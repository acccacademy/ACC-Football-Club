import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS profile (
      id SERIAL PRIMARY KEY,
      data JSONB NOT NULL
    );

    CREATE TABLE IF NOT EXISTS links (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      subtitle VARCHAR(500),
      url VARCHAR(1000) NOT NULL,
      icon_name VARCHAR(50) NOT NULL,
      clicks INTEGER DEFAULT 0,
      color_preset VARCHAR(50) DEFAULT 'carbon',
      is_active BOOLEAN DEFAULT true,
      sort_order INTEGER DEFAULT 0
    );
  `);

  // Insert default profile if not exists
  const profileRes = await pool.query('SELECT id FROM profile LIMIT 1');
  if (profileRes.rowCount === 0) {
    await pool.query(`
      INSERT INTO profile (data) VALUES ($1)
    `, [JSON.stringify({
      name: "ACC Football Club",
      role: "ACC Football Club",
      bio: "الصفحة الرسمية لأكاديمية نادي أسمنت أسيوط الرياضي (فرع الجامعة) • يسعدنا تواصلكم ومتابعتكم لمنصاتنا الرسمية.",
      avatarUrl: "https://6a1312f6086634e369990ddc.imgix.net/cemex_2026/cemex_2026.webp?auto=format&fit=fill&w=384",
      avatarPreset: "carbon",
      instaPayAddress: "cemex_2026@instapay",
      instaPayEmail: "acccacademy@gmail.com",
      contactPhone: "+201022228017",
      contactEmail: "acccacademy@gmail.com"
    })]);
  }

  // Insert default links if not exists
  const linksRes = await pool.query('SELECT id FROM links LIMIT 1');
  if (linksRes.rowCount === 0) {
    const defaultLinks = [
      { id: 'link_cemexawy', title: 'Cemexawy', subtitle: 'تطبيق مخصص لأولياء امور لاعبين اكاديمية اسمنت اسيوط لمتابعة اداء ابنائهم', url: 'https://play.google.com/store/apps/details?id=com.cemex.app', iconName: 'playcircle', clicks: 0, colorPreset: 'carbon', isActive: true, sortOrder: 0 },
      { id: 'link_1', title: 'Assiut Cement Company FC WhatsApp group', subtitle: 'المجتمع الرسمي للأكاديمية • مواعيد وتطور التدريبات والأنشطة المشتركة', url: 'https://chat.whatsapp.com/L17VgHz8f14IXxnzZU24sr', iconName: 'messagesquare', clicks: 1482, colorPreset: 'carbon', isActive: true, sortOrder: 1 },
      { id: 'link_2', title: 'Explore Assiut Cement Company FC on Facebook', subtitle: 'الصفحة الرسمية على فيسبوك • أخبار وتغطية شاملة للمباريات والفعاليات', url: 'https://www.facebook.com/ACCFootballClub', iconName: 'facebook', clicks: 2981, colorPreset: 'carbon', isActive: true, sortOrder: 2 },
      { id: 'link_3', title: 'Explore Assiut Cement Company FC Instagram', subtitle: 'حساب الإنستجرام الرسمي • كواليس وصور الأكاديمية واللاعبين اليومية', url: 'https://www.instagram.com/assiutcementfc', iconName: 'instagram', clicks: 1845, colorPreset: 'carbon', isActive: true, sortOrder: 3 },
      { id: 'link_instapay', title: 'بوابة دفع واشتراكات الأكاديمية الآمنة - InstaPay', subtitle: 'خط الدفع الإلكتروني المباشر لتحصيل الاشتراكات الرسمية المؤمنة للهواتف', url: 'https://ipn.eg/S/cemex_2026/instapay/4L6Qx3', iconName: 'landmark', clicks: 954, colorPreset: 'indigo', isActive: true, sortOrder: 4 },
    ];
    for (const link of defaultLinks) {
      await pool.query(
        `INSERT INTO links (id, title, subtitle, url, icon_name, clicks, color_preset, is_active, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [link.id, link.title, link.subtitle, link.url, link.iconName, link.clicks, link.colorPreset, link.isActive, link.sortOrder]
      );
    }
  }

  console.log('Database initialized');
};

export default pool;
