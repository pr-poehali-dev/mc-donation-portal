import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление донатами - создание и получение списка
    Args: event с httpMethod (GET/POST), body для POST запросов
    Returns: JSON с данными донатов или результатом создания
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if method == 'GET':
        cursor.execute('''
            SELECT id, player_nickname, package_name, amount, status, 
                   phone, created_at, notes
            FROM donations 
            ORDER BY created_at DESC 
            LIMIT 100
        ''')
        donations = cursor.fetchall()
        
        donations_list = []
        for d in donations:
            donations_list.append({
                'id': d['id'],
                'player_nickname': d['player_nickname'],
                'package_name': d['package_name'],
                'amount': d['amount'],
                'status': d['status'],
                'phone': d['phone'],
                'created_at': d['created_at'].isoformat() if d['created_at'] else None,
                'notes': d['notes']
            })
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'donations': donations_list}, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        player_nickname = body_data.get('player_nickname', '')
        package_name = body_data.get('package_name', '')
        amount = body_data.get('amount', 0)
        phone = body_data.get('phone', '')
        
        cursor.execute('''
            INSERT INTO donations (player_nickname, package_name, amount, phone, status)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        ''', (player_nickname, package_name, amount, phone, 'pending'))
        
        result = cursor.fetchone()
        donation_id = result['id']
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'donation_id': donation_id,
                'message': 'Donation created successfully'
            }),
            'isBase64Encoded': False
        }
    
    if method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        donation_id = body_data.get('id')
        new_status = body_data.get('status')
        notes = body_data.get('notes', '')
        
        cursor.execute('''
            UPDATE donations 
            SET status = %s, notes = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
        ''', (new_status, notes, donation_id))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True, 'message': 'Donation updated'}),
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
