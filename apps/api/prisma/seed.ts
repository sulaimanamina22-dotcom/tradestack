import { PrismaClient, PlanType, UserRole, LogStatus, OvertimeRule, RestitutionStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🏗️  Starting TradeStack Seeding...')

  // 1. CREATE TENANT
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Apex Builders Inc.',
      subdomain: 'apex',
      subscription: PlanType.PROFESSIONAL,
      ot_rule: OvertimeRule.DAILY_8,
    }
  })
  console.log(`✅ Tenant Created: ${tenant.name}`)

  // 2. CREATE WAGE SHEET (San Diego Electrician)
  const wageSheet = await prisma.wageDetermination.create({
    data: {
      tenant_id: tenant.id,
      code: 'CA-SD-ELEC-2024-1',
      jurisdiction: 'San Diego County',
      effective_date: new Date('2024-01-01'), 
    }
  })

  // Rates: Electrician (Correct) vs Laborer (Lower)
  const rateElectrician = await prisma.tradeRate.create({
    data: {
      determination_id: wageSheet.id,
      classification: 'Electrician - Inside Wireman',
      rate_base: 52.00, rate_health: 11.20, rate_pension: 14.50, 
      rate_vacation: 3.50, rate_training: 1.10, rate_other: 0.45,
      total_package: 82.75
    }
  })

  const rateLaborer = await prisma.tradeRate.create({
    data: {
      determination_id: wageSheet.id,
      classification: 'General Laborer',
      rate_base: 28.00, rate_health: 8.00, rate_pension: 5.00,
      rate_vacation: 1.00, rate_training: 0.80, rate_other: 0.10,
      total_package: 42.90
    }
  })
  console.log(`✅ Wage Sheet Created with 2 Classifications`)

  // 3. CREATE USERS
  const worker = await prisma.user.create({
    data: {
      tenant_id: tenant.id,
      email: 'mike@trade-stack.com',
      password_hash: 'secret',
      full_name: 'Mike Hammer',
      role: UserRole.WORKER,
      trade_level: 'Journeyman',
      default_trade: 'Electrician',
      lifetime_hours: 3850,
    }
  })

  // 4. CREATE PROJECT (Locked to Wage Sheet)
  const project = await prisma.project.create({
    data: {
      tenant_id: tenant.id,
      name: 'Downtown Library Retrofit',
      job_number: '24-055',
      wage_sheet_id: wageSheet.id,
      geo_lat: 32.7157, geo_long: -117.1611,
    }
  })

  // 5. CREATE "THE PROBLEM" (Underpaid Time Log)
  const badLog = await prisma.timeLog.create({
    data: {
      user_id: worker.id,
      project_id: project.id,
      trade_rate_id: rateLaborer.id, // <--- ERROR: Paid as Laborer
      clock_in: new Date('2024-06-10T07:00:00Z'),
      clock_out: new Date('2024-06-10T15:30:00Z'), // 8.5 hours
      duration_hrs: 8.5,
      status: LogStatus.APPROVED,
    }
  })

  // 6. CREATE RESTITUTION RECORD
  await prisma.restitutionRecord.create({
    data: {
      original_log_id: badLog.id,
      reason: 'Audit Correction: Reclassified Laborer -> Electrician',
      owed_cash: 204.00,   // ($52 - $28) * 8.5
      owed_fringe: 134.72, 
      status: RestitutionStatus.PENDING,
    }
  })

  console.log(`✅ Seed Complete: Created "The Audit Trap" scenario.`)
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })