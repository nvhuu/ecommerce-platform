import api from "@/lib/api";
import { UserOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Rate, Skeleton } from "antd";
import { format } from "date-fns";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user?: {
    email: string; // or name if available
  };
  createdAt: string;
}

interface ReviewsListProps {
  productId: string;
}

export function ReviewsList({ productId }: ReviewsListProps) {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const res = await api.get(`/reviews/product/${productId}`);
      return res.data.data as Review[];
    },
  });

  if (isLoading) return <Skeleton active avatar paragraph={{ rows: 3 }} />;

  if (!reviews || reviews.length === 0) {
    return <div className='text-gray-500 italic mt-4'>No reviews yet. Be the first to review!</div>;
  }

  return (
    <div className='space-y-6 mt-6'>
      {reviews.map((review) => (
        <div key={review.id} className='border-b pb-6 last:border-0'>
          <div className='flex items-center gap-3 mb-2'>
            <Avatar icon={<UserOutlined />} />
            <div>
              <p className='font-medium text-sm'>{review.user?.email || "Anonymous User"}</p>
              <div className='flex items-center gap-2 text-xs text-gray-400'>
                <span>{format(new Date(review.createdAt), "MMM dd, yyyy")}</span>
              </div>
            </div>
          </div>
          <Rate disabled defaultValue={review.rating} className='text-sm mb-2' />
          <p className='text-gray-700'>{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
