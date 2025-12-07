import { ProductForm } from "@/components/ProductForm";

export default function CreateProductPage() {
  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold tracking-tight'>Create Product</h1>
      <ProductForm />
    </div>
  );
}
