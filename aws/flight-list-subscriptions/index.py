import json, re, boto3
from boto3.dynamodb.conditions import Key

TABLE = boto3.resource("dynamodb").Table("subscriptions")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _resp(code, body):
    return {"statusCode": code, "headers": {"content-type": "application/json"},
            "body": json.dumps(body, ensure_ascii=False)}


def handler(event, context):
    # NOTE: trusts a client-supplied email with no auth (course scope);
    # production would verify the Supabase JWT here first.
    qs = event.get("queryStringParameters") or {}
    email = str(qs.get("email", "")).strip().lower()
    if not EMAIL_RE.match(email):
        return _resp(400, {"error": "invalid email"})
    # ConsistentRead: the UI re-fetches right after POST /subscribe, so read-your-writes matters.
    items = TABLE.query(KeyConditionExpression=Key("email").eq(email),
                        ConsistentRead=True).get("Items", [])
    subs = [{"route": it["route"], "plan_name": it.get("plan_name"),
             "target_price": int(it["target_price"]), "currency": it.get("currency", "TWD"),
             "created_at": it.get("created_at"), "updated_at": it.get("updated_at")}
            for it in items]
    return _resp(200, {"email": email, "subscriptions": subs})
