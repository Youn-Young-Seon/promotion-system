import { PrismaClient } from '../prisma/generated/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding products...');

    // 기존 데이터 삭제
    await prisma.timeSaleOrder.deleteMany();
    await prisma.timeSale.deleteMany();
    await prisma.product.deleteMany();

    // 샘플 상품 생성
    const products = await Promise.all([
        prisma.product.create({
            data: {
                name: '무선 이어폰 Pro',
                price: BigInt(199000),
                description: '프리미엄 노이즈 캔슬링 무선 이어폰',
            },
        }),
        prisma.product.create({
            data: {
                name: '스마트워치 Ultra',
                price: BigInt(459000),
                description: '건강 관리 및 피트니스 트래킹',
            },
        }),
        prisma.product.create({
            data: {
                name: '블루투스 스피커',
                price: BigInt(89000),
                description: '360도 사운드, 방수 기능',
            },
        }),
        prisma.product.create({
            data: {
                name: '노트북 스탠드',
                price: BigInt(35000),
                description: '각도 조절 가능, 알루미늄 재질',
            },
        }),
        prisma.product.create({
            data: {
                name: '기계식 키보드',
                price: BigInt(129000),
                description: 'RGB 백라이트, 청축',
            },
        }),
    ]);

    console.log(`Created ${products.length} products`);

    // 샘플 타임세일 생성
    const now = new Date();
    const startAt = new Date(now.getTime() + 1000 * 60 * 5); // 5분 후 시작
    const endAt = new Date(now.getTime() + 1000 * 60 * 65); // 65분 후 종료

    const timeSales = await Promise.all([
        prisma.timeSale.create({
            data: {
                productId: products[0].id,
                quantity: BigInt(100),
                remainingQuantity: BigInt(100),
                discountPrice: BigInt(149000), // 25% 할인
                startAt,
                endAt,
                status: 'SCHEDULED',
            },
        }),
        prisma.timeSale.create({
            data: {
                productId: products[1].id,
                quantity: BigInt(50),
                remainingQuantity: BigInt(50),
                discountPrice: BigInt(349000), // 24% 할인
                startAt,
                endAt,
                status: 'SCHEDULED',
            },
        }),
        prisma.timeSale.create({
            data: {
                productId: products[2].id,
                quantity: BigInt(200),
                remainingQuantity: BigInt(200),
                discountPrice: BigInt(59000), // 34% 할인
                startAt,
                endAt,
                status: 'SCHEDULED',
            },
        }),
    ]);

    console.log(`Created ${timeSales.length} time sales`);
    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
