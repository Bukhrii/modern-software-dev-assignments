import re


def extract_action_items(text: str) -> list[str]:
    patterns = [
        r'(?i)todo:\s*(.+)',
        r'(?i)action:\s*(.+)',
        r'(?i)task:\s*(.+)',
        r'(?i)fixme:\s*(.+)',
        r'-\s*\[\s*\]\s*(.+)',
        r'-\s*\[\s*x\s*\]\s*(.+)',
    ]
    items = []
    for pattern in patterns:
        matches = re.findall(pattern, text)
        items.extend(matches)
    return items


