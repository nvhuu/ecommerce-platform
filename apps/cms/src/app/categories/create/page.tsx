import { CategoryForm } from "@/components/CategoryForm";

export default function CreateCategoryPage() {
  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold tracking-tight'>Create Category</h1>
      <CategoryForm />
    </div>
  );
}
