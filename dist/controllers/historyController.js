import pool from '../db.js';
export async function logAction(request, reply) {
    const { action_type, product_id, shop_id, details } = request.body;
    try {
        const query = `
            INSERT INTO actions (action_type, product_id, shop_id, details)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [action_type, product_id, shop_id, details || {}];
        const result = await pool.query(query, values);
        reply.code(201).send(result.rows[0]);
    }
    catch (error) {
        console.error('Error logging action:', error);
        reply.code(500).send({ error: 'Failed to log action' });
    }
}

export async function getActions(request, reply) {
    const { shop_id, plu, date_from, date_to, action, page = 1, limit = 10 } = request.query;

    try {
        let query = `
            SELECT actions.*, products.plu, products.name
            FROM actions
            LEFT JOIN products ON actions.product_id = products.id
            WHERE 1=1
        `;
        const values = [];

        if (shop_id) {
            values.push(shop_id);
            query += ` AND actions.shop_id = $${values.length}`;
        }

        if (plu) {
            values.push(plu);
            query += ` AND products.plu = $${values.length}`;
        }

        if (date_from) {
            values.push(date_from);
            query += ` AND actions.action_date >= $${values.length}`;
        }

        if (date_to) {
            values.push(date_to);
            query += ` AND actions.action_date <= $${values.length}`;
        }

        if (action) {
            values.push(action);
            query += ` AND actions.action_type = $${values.length}`;
        }

        const offset = (page - 1) * limit;
        query += ` ORDER BY actions.action_date DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(limit, offset);

        const result = await pool.query(query, values);

        reply.code(200).send(result.rows);
    } catch (error) {
        console.error('Error retrieving actions:', error);
        reply.code(500).send({ error: 'Failed to retrieve actions' });
    }
}