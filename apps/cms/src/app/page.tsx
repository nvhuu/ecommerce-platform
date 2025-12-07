export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900'>Dashboard</h1>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <DashboardCard title='Total Revenue' value='$45,231.89' change='+20.1% from last month' />
        <DashboardCard title='Orders' value='+2350' change='+180.1% from last month' />
        <DashboardCard title='Products' value='+12,234' change='+19% from last month' />
        <DashboardCard title='Active Now' value='+573' change='+201 since last hour' />
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <div className='col-span-4 bg-white p-6 rounded-lg border shadow-sm'>
          <h3 className='text-lg font-medium'>Recent Revenue</h3>
          <div className='h-[200px] flex items-center justify-center text-gray-400'>
            Chart Placeholder
          </div>
        </div>
        <div className='col-span-3 bg-white p-6 rounded-lg border shadow-sm'>
          <h3 className='text-lg font-medium'>Recent Sales</h3>
          <div className='space-y-4 mt-4'>
            <SaleItem name='Olivia Martin' email='olivia.martin@email.com' amount='+$1,999.00' />
            <SaleItem name='Jackson Lee' email='jackson.lee@email.com' amount='+$39.00' />
            <SaleItem name='Isabella Nguyen' email='isabella.nguyen@email.com' amount='+$299.00' />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div className='rounded-xl border bg-white p-6 shadow-sm'>
      <div className='flex flex-col space-y-1.5'>
        <h3 className='text-sm font-medium text-gray-500'>{title}</h3>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-gray-500'>{change}</p>
      </div>
    </div>
  );
}

function SaleItem({ name, email, amount }: { name: string; email: string; amount: string }) {
  return (
    <div className='flex items-center'>
      <div className='space-y-1'>
        <p className='text-sm font-medium leading-none'>{name}</p>
        <p className='text-sm text-muted-foreground text-gray-500'>{email}</p>
      </div>
      <div className='ml-auto font-medium'>{amount}</div>
    </div>
  );
}
