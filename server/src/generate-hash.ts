import bcrypt from 'bcrypt';

const password = process.argv[2];

if (!password) {
  console.log('الاستخدام: npx ts-node src/generate-hash.ts "باسوردك"');
  process.exit(1);
}

bcrypt.hash(password, 12).then(hash => {
  console.log('\n✅ الهاش جاهز — حطه في .env:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
});
