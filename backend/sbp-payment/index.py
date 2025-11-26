import json
from typing import Dict, Any
import base64
from io import BytesIO

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Генерация данных для оплаты через СБП
    Args: event с httpMethod, queryStringParameters (amount, package_name)
    Returns: JSON с данными для оплаты
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {})
        amount = params.get('amount', '0')
        package_name = params.get('package', 'Донат')
        
        phone = '+79179231812'
        bank_name = 'Т-Банк'
        
        sbp_link = f'https://qr.nspk.ru/proxyapp?type=01&bank=100000000111&sum={amount}&cur=RUB&crc=1234'
        
        response_data = {
            'phone': phone,
            'bank': bank_name,
            'amount': amount,
            'package': package_name,
            'sbp_link': sbp_link,
            'qr_data': f'Перевод {amount}₽ для {package_name}'
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(response_data, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
