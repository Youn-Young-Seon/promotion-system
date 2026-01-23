/**
 * 성능 테스트 스크립트
 * V1 (DB), V2 (Redis), V3 (Kafka) 전략의 처리량과 응답 시간을 비교
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:4000';
const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

// 성능 테스트 설정
const TEST_CONFIG = {
    coupon: {
        endpoint: '/api/coupons/issue',
        payload: (userId) => ({
            policyId: '6',
            userId: String(userId),
        }),
    },
    point: {
        endpoint: '/api/points/add',
        payload: (userId) => ({
            userId: String(userId),
            amount: 100,
            description: 'Performance test',
        }),
    },
    timesale: {
        endpoint: '/api/timesales/1/orders',
        payload: (userId) => ({
            userId: String(userId),
            quantity: 1,
        }),
    },
};

/**
 * 단일 요청 실행
 */
async function sendRequest(service, strategy, userId) {
    const config = TEST_CONFIG[service];
    const startTime = Date.now();

    try {
        const response = await axios.post(
            `${BASE_URL}${config.endpoint}?strategy=${strategy}`,
            config.payload(userId),
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000,
            }
        );

        const endTime = Date.now();
        return {
            success: true,
            duration: endTime - startTime,
            status: response.status,
            data: response.data,
        };
    } catch (error) {
        const endTime = Date.now();
        return {
            success: false,
            duration: endTime - startTime,
            status: error.response?.status || 0,
            error: error.response?.data?.message || error.response?.data || error.message,
        };
    }
}

/**
 * 동시 요청 실행
 */
async function runConcurrentRequests(service, strategy, totalRequests, concurrency) {
    console.log(`\n${COLORS.cyan}[${service.toUpperCase()}] Strategy: ${strategy} - ${totalRequests} requests (${concurrency} concurrent)${COLORS.reset}`);

    const results = {
        success: 0,
        failed: 0,
        durations: [],
        errors: {},
    };

    const startTime = Date.now();
    let completed = 0;

    // 요청을 배치로 나누어 실행
    const baseUserId = Date.now(); // Use timestamp as base to avoid duplicates
    for (let i = 0; i < totalRequests; i += concurrency) {
        const batch = [];
        const batchSize = Math.min(concurrency, totalRequests - i);

        for (let j = 0; j < batchSize; j++) {
            const userId = baseUserId + i + j;
            batch.push(sendRequest(service, strategy, userId));
        }

        const batchResults = await Promise.all(batch);

        batchResults.forEach((result) => {
            completed++;
            if (result.success) {
                results.success++;
                results.durations.push(result.duration);
            } else {
                results.failed++;
                const errorKey = result.error || 'Unknown';
                results.errors[errorKey] = (results.errors[errorKey] || 0) + 1;
            }

            // 진행률 출력 (10% 단위)
            if (completed % Math.ceil(totalRequests / 10) === 0) {
                const progress = ((completed / totalRequests) * 100).toFixed(0);
                process.stdout.write(`\r${COLORS.yellow}Progress: ${progress}%${COLORS.reset}`);
            }
        });
    }

    const endTime = Date.now();
    const totalDuration = (endTime - startTime) / 1000; // seconds

    console.log(`\r${COLORS.green}Progress: 100%${COLORS.reset}`);

    // 통계 계산
    const stats = calculateStats(results, totalDuration);
    printResults(service, strategy, stats);

    return stats;
}

/**
 * 통계 계산
 */
function calculateStats(results, totalDuration) {
    const { success, failed, durations } = results;

    if (durations.length === 0) {
        return {
            success,
            failed,
            totalDuration,
            tps: 0,
            avgResponseTime: 0,
            minResponseTime: 0,
            maxResponseTime: 0,
            p50: 0,
            p95: 0,
            p99: 0,
            errors: results.errors,
        };
    }

    durations.sort((a, b) => a - b);

    const sum = durations.reduce((acc, val) => acc + val, 0);
    const avg = sum / durations.length;
    const min = durations[0];
    const max = durations[durations.length - 1];

    const p50 = durations[Math.floor(durations.length * 0.5)];
    const p95 = durations[Math.floor(durations.length * 0.95)];
    const p99 = durations[Math.floor(durations.length * 0.99)];

    const tps = success / totalDuration;

    return {
        success,
        failed,
        totalDuration,
        tps: tps.toFixed(2),
        avgResponseTime: avg.toFixed(2),
        minResponseTime: min,
        maxResponseTime: max,
        p50,
        p95,
        p99,
        errors: results.errors,
    };
}

/**
 * 결과 출력
 */
function printResults(service, strategy, stats) {
    console.log(`\n${COLORS.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
    console.log(`${COLORS.bright}[${service.toUpperCase()}] ${strategy.toUpperCase()} Performance Results${COLORS.reset}`);
    console.log(`${COLORS.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);

    console.log(`${COLORS.green}✓ Success:${COLORS.reset} ${stats.success}`);
    console.log(`${COLORS.red}✗ Failed:${COLORS.reset} ${stats.failed}`);
    console.log(`${COLORS.cyan}⏱  Total Duration:${COLORS.reset} ${stats.totalDuration.toFixed(2)}s`);
    console.log(`${COLORS.magenta}⚡ TPS (Transactions/sec):${COLORS.reset} ${COLORS.bright}${stats.tps}${COLORS.reset}`);

    console.log(`\n${COLORS.blue}Response Time Statistics (ms):${COLORS.reset}`);
    console.log(`  Average: ${stats.avgResponseTime}ms`);
    console.log(`  Min: ${stats.minResponseTime}ms`);
    console.log(`  Max: ${stats.maxResponseTime}ms`);
    console.log(`  P50 (Median): ${stats.p50}ms`);
    console.log(`  P95: ${stats.p95}ms`);
    console.log(`  P99: ${stats.p99}ms`);

    if (Object.keys(stats.errors).length > 0) {
        console.log(`\n${COLORS.red}Errors:${COLORS.reset}`);
        Object.entries(stats.errors).forEach(([error, count]) => {
            console.log(`  ${error}: ${count}`);
        });
    }
}

/**
 * 비교 결과 출력
 */
function printComparison(service, allResults) {
    console.log(`\n\n${COLORS.bright}${'='.repeat(60)}${COLORS.reset}`);
    console.log(`${COLORS.bright}${' '.repeat(15)}[${service.toUpperCase()}] STRATEGY COMPARISON${COLORS.reset}`);
    console.log(`${COLORS.bright}${'='.repeat(60)}${COLORS.reset}\n`);

    console.log(`${'Strategy'.padEnd(15)} ${'TPS'.padEnd(12)} ${'Avg Time'.padEnd(12)} ${'P95'.padEnd(12)} ${'Success Rate'}`);
    console.log(`${'-'.repeat(60)}`);

    ['v1', 'v2', 'v3'].forEach((strategy) => {
        const stats = allResults[strategy];
        if (!stats) return;

        const successRate = ((stats.success / (stats.success + stats.failed)) * 100).toFixed(1);
        const tpsColor = stats.tps > 1000 ? COLORS.green : stats.tps > 500 ? COLORS.yellow : COLORS.red;

        console.log(
            `${strategy.toUpperCase().padEnd(15)} ` +
            `${tpsColor}${stats.tps.toString().padEnd(12)}${COLORS.reset}` +
            `${stats.avgResponseTime.toString().padEnd(12)}ms ` +
            `${stats.p95.toString().padEnd(12)}ms ` +
            `${successRate}%`
        );
    });

    console.log(`\n${COLORS.bright}Performance Ranking:${COLORS.reset}`);
    const ranked = Object.entries(allResults)
        .sort(([, a], [, b]) => parseFloat(b.tps) - parseFloat(a.tps))
        .map(([strategy], index) => `  ${index + 1}. ${strategy.toUpperCase()}`);
    ranked.forEach((rank) => console.log(rank));
}

/**
 * 메인 테스트 실행
 */
async function runPerformanceTest(service, totalRequests = 1000, concurrency = 100) {
    console.log(`\n${COLORS.bright}╔${'═'.repeat(58)}╗${COLORS.reset}`);
    console.log(`${COLORS.bright}║${' '.repeat(10)}Performance Test: ${service.toUpperCase()}${' '.repeat(30 - service.length)}║${COLORS.reset}`);
    console.log(`${COLORS.bright}╚${'═'.repeat(58)}╝${COLORS.reset}`);
    console.log(`${COLORS.cyan}Total Requests: ${totalRequests}${COLORS.reset}`);
    console.log(`${COLORS.cyan}Concurrency: ${concurrency}${COLORS.reset}`);

    const results = {};

    // V1 테스트 (Database)
    results.v1 = await runConcurrentRequests(service, 'v1', totalRequests, concurrency);
    await sleep(2000); // 서비스 회복 시간

    // V2 테스트 (Redis)
    results.v2 = await runConcurrentRequests(service, 'v2', totalRequests, concurrency);
    await sleep(2000);

    // V3 테스트 (Kafka)
    results.v3 = await runConcurrentRequests(service, 'v3', totalRequests, concurrency);

    // 비교 결과 출력
    printComparison(service, results);

    return results;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * CLI 실행
 */
async function main() {
    const args = process.argv.slice(2);
    const service = args[0] || 'coupon'; // coupon, point, timesale
    const totalRequests = parseInt(args[1]) || 1000;
    const concurrency = parseInt(args[2]) || 100;

    if (!['coupon', 'point', 'timesale'].includes(service)) {
        console.error(`${COLORS.red}Invalid service. Use: coupon, point, or timesale${COLORS.reset}`);
        process.exit(1);
    }

    console.log(`${COLORS.bright}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     PROMOTION SYSTEM - PERFORMANCE TEST                   ║
║     V1 (DB) vs V2 (Redis) vs V3 (Kafka)                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
${COLORS.reset}`);

    try {
        await runPerformanceTest(service, totalRequests, concurrency);
    } catch (error) {
        console.error(`${COLORS.red}Test failed: ${error.message}${COLORS.reset}`);
        process.exit(1);
    }
}

// CLI에서 직접 실행된 경우에만 실행
if (require.main === module) {
    main();
}

module.exports = { runPerformanceTest, sendRequest };
