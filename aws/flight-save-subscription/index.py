import json, base64, re, boto3
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation

PLANS = {"tokyo": {"origin": "TPE", "destination": "TYO"},
         "seoul": {"origin": "TPE", "destination": "SEL"}}
TABLE = boto3.resource("dynamodb").Table("subscriptions")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _resp(code, body):
    return {"statusCode": code, "headers": {"content-type": "application/json"},
            "body": json.dumps(body, ensure_ascii=False)}


def handler(event, context):
    raw = event.get("body") or "{}"
    if event.get("isBase64Encoded"):
        raw = base64.b64decode(raw).decode("utf-8")
    try:
        data = json.loads(raw) if isinstance(raw, str) else raw
    except ValueError:
        return _resp(400, {"error": "invalid JSON body"})
    if not isinstance(data, dict):
        return _resp(400, {"error": "body must be a JSON object"})

    email = str(data.get("email", "")).strip().lower()
    plan = str(data.get("plan_name", "")).strip().lower()
    if not EMAIL_RE.match(email):
        return _resp(400, {"error": "invalid email"})
    if plan not in PLANS:
        return _resp(400, {"error": "plan_name must be tokyo or seoul"})
    try:
        tp = Decimal(str(data.get("target_price")))
    except (InvalidOperation, ValueError, TypeError):
        return _resp(400, {"error": "target_price must be a number"})
    if not tp.is_finite() or tp <= 0 or tp > 1000000:
        return _resp(400, {"error": "target_price must be between 1 and 1,000,000 TWD"})
    tp = tp.quantize(Decimal("1"))

    p = PLANS[plan]
    route = p["origin"] + "-" + p["destination"]
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    # upsert: keep created_at on re-subscribe / target update. NO subscription_status in M1.
    TABLE.update_item(
        Key={"email": email, "route": route},
        UpdateExpression=("SET #pn=:pn, #o=:o, #d=:d, #tp=:tp, #c=:c, #u=:u, "
                          "#ca=if_not_exists(#ca, :u)"),
        ExpressionAttributeNames={"#pn": "plan_name", "#o": "origin", "#d": "destination",
                                  "#tp": "target_price", "#c": "currency",
                                  "#u": "updated_at", "#ca": "created_at"},
        ExpressionAttributeValues={":pn": plan, ":o": p["origin"], ":d": p["destination"],
                                   ":tp": tp, ":c": "TWD", ":u": now})
    print("saved", email, route, int(tp))
    return _resp(200, {"ok": True, "email": email, "route": route, "plan_name": plan,
                       "target_price": int(tp), "currency": "TWD"})
