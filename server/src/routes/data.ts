import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db';

const router = Router();

// Middleware to verify admin token
const verifyAdmin = (req: Request, res: Response, next: any) => {
  const token = req.cookies?.admin_token;
  const jwtSecret = process.env.JWT_SECRET;
  if (!token || !jwtSecret) return res.status(401).json({ success: false });
  try {
    jwt.verify(token, jwtSecret);
    next();
  } catch {
    return res.status(401).json({ success: false });
  }
};

// GET profile (public)
router.get('/profile', async (_req, res) => {
  try {
    const result = await pool.query('SELECT data FROM profile LIMIT 1');
    if (result.rowCount === 0) return res.status(404).json({ success: false });
    return res.json({ success: true, data: result.rows[0].data });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
});

// UPDATE profile (admin only)
router.post('/profile', verifyAdmin, async (req, res) => {
  try {
    const profileData = req.body;
    await pool.query('UPDATE profile SET data = $1', [JSON.stringify(profileData)]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
});

// GET links (public)
router.get('/links', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM links ORDER BY sort_order ASC');
    const links = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      url: row.url,
      iconName: row.icon_name,
      clicks: row.clicks,
      colorPreset: row.color_preset,
      isActive: row.is_active,
    }));
    return res.json({ success: true, data: links });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
});

// UPDATE links (admin only)
router.post('/links', verifyAdmin, async (req, res) => {
  try {
    const links = req.body as any[];
    // Delete all and re-insert
    await pool.query('DELETE FROM links');
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      await pool.query(
        `INSERT INTO links (id, title, subtitle, url, icon_name, clicks, color_preset, is_active, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [link.id, link.title, link.subtitle || '', link.url, link.iconName, link.clicks || 0, link.colorPreset || 'carbon', link.isActive, i]
      );
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
});

// INCREMENT click count (public)
router.post('/links/:id/click', async (req, res) => {
  try {
    await pool.query('UPDATE links SET clicks = clicks + 1 WHERE id = $1', [req.params.id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
});

export default router;
