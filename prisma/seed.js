const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed işlemi başlıyor...')

  // 1. TEMİZLİK (Hata Olursa Yoksay)
  // Eğer veritabanı sıfırsa tablolar henüz yoktur, silmeye çalışınca hata verir.
  // Bu yüzden try-catch içine alıyoruz.
  try {
    console.log('🧹 Eski veriler temizleniyor...')
    await prisma.transaction.deleteMany()
    await prisma.product.deleteMany()
    await prisma.partner.deleteMany()
    await prisma.user.deleteMany()
    console.log('✨ Tablolar temizlendi.')
  } catch (error) {
    console.log('⚠️ Tablolar henüz boş veya bulunamadı, oluşturmaya geçiliyor...')
  }

  // 2. ŞİFRELEME
  const hashedPassword = await hash('admin123', 12)

  // 3. ADMİN OLUŞTURMA
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {
      password: hashedPassword, // Şifreyi güncelle (ne olur ne olmaz)
      role: 'ADMIN',
      status: 'APPROVED'
    },
    create: {
      email: 'admin@gmail.com',
      name: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'APPROVED',
      image: '', 
    },
  })

  console.log('✅ Admin hesabı HAZIR!')
  console.log('-----------------------------------')
  console.log('📧 Email: admin@gmail.com')
  console.log('🔑 Şifre: admin123')
  console.log('-----------------------------------')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ HATA:', e)
    await prisma.$disconnect()
    process.exit(1)
  })