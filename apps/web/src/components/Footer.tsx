export function Footer() {
  return (
    <footer className='bg-white border-t py-12'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div>
            <h3 className='font-bold text-lg mb-4'>LuxeStore</h3>
            <p className='text-gray-500 text-sm'>
              Premium quality products for your lifestyle. Experience the difference.
            </p>
          </div>
          <div>
            <h4 className='font-semibold mb-4'>Shop</h4>
            <ul className='space-y-2 text-sm text-gray-500'>
              <li>
                <a href='/products' className='hover:text-black'>
                  All Products
                </a>
              </li>
              <li>
                <a href='/products?category=clothing' className='hover:text-black'>
                  Clothing
                </a>
              </li>
              <li>
                <a href='/products?category=accessories' className='hover:text-black'>
                  Accessories
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='font-semibold mb-4'>Company</h4>
            <ul className='space-y-2 text-sm text-gray-500'>
              <li>
                <a href='/about' className='hover:text-black'>
                  About Us
                </a>
              </li>
              <li>
                <a href='/contact' className='hover:text-black'>
                  Contact
                </a>
              </li>
              <li>
                <a href='/terms' className='hover:text-black'>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='font-semibold mb-4'>Newsletter</h4>
            <p className='text-sm text-gray-500 mb-2'>Subscribe for updates.</p>
            <div className='flex'>
              <input
                type='email'
                placeholder='Email'
                className='border p-2 w-full text-sm rounded-l-md focus:outline-none focus:ring-1 focus:ring-black'
              />
              <button className='bg-black text-white px-4 py-2 text-sm rounded-r-md'>Join</button>
            </div>
          </div>
        </div>
        <div className='border-t mt-12 pt-8 text-center text-sm text-gray-400'>
          © {new Date().getFullYear()} LuxeStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
