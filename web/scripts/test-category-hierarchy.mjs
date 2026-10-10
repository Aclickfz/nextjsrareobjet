import assert from 'node:assert/strict';
import mysql from 'mysql2/promise';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd(), true);
const db=await mysql.createConnection({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME,ssl:process.env.DB_SSL==='true'?{rejectUnauthorized:false}:undefined});
try {
 await db.beginTransaction();
 const [roots]=await db.query("SELECT id FROM categories WHERE slug='furniture'");assert.ok(roots[0]);
 const suffix=Date.now();
 const [group]=await db.execute('INSERT INTO categories(name,slug,parent_id) VALUES(?,?,?)',['Test group',`test-group-${suffix}`,roots[0].id]);
 const [sub]=await db.execute('INSERT INTO categories(name,slug,parent_id) VALUES(?,?,?)',['Test sub',`test-sub-${suffix}`,group.insertId]);
 const [child]=await db.execute('INSERT INTO categories(name,slug,parent_id) VALUES(?,?,?)',['Test child',`test-child-${suffix}`,sub.insertId]);
 for(const order of [10,2]) await db.execute('INSERT INTO products(name,slug,category_id,price,sort_order) VALUES(?,?,?,?,?)',['Test',`test-${suffix}-${order}`,child.insertId,1,order]);
 const sql='SELECT p.sort_order FROM products p JOIN categories c ON c.id=p.category_id LEFT JOIN categories parent ON parent.id=c.parent_id LEFT JOIN categories grandparent ON grandparent.id=parent.parent_id LEFT JOIN categories greatgrandparent ON greatgrandparent.id=grandparent.parent_id WHERE (c.id=? OR parent.id=? OR grandparent.id=? OR greatgrandparent.id=?) AND p.is_active=1 AND c.is_active=1 AND (parent.id IS NULL OR parent.is_active=1) AND (grandparent.id IS NULL OR grandparent.is_active=1) AND (greatgrandparent.id IS NULL OR greatgrandparent.is_active=1) AND p.slug LIKE ? ORDER BY p.sort_order,p.id';
 for(const id of [roots[0].id,group.insertId,sub.insertId,child.insertId]) {const [rows]=await db.execute(sql,[id,id,id,id,`test-${suffix}-%`]);assert.deepEqual(rows.map(r=>r.sort_order),[2,10]);}
 await db.execute('UPDATE categories SET is_active=0 WHERE id=?',[group.insertId]);
 const [hidden]=await db.execute(sql,[sub.insertId,sub.insertId,sub.insertId,sub.insertId,`test-${suffix}-%`]);assert.equal(hidden.length,0);
 console.log('PASS: four-level category filtering, sort order, hidden ancestors. Test records rolled back.');
} finally {await db.rollback();await db.end();}
