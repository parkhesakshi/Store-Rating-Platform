import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { Button } from './ui/Button';
import { Star, X } from 'lucide-react';
import { getErrorMessage } from '../lib/error-handler';

interface Rating {
  id: string;
  score: number;
  userId: string;
  storeId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface RatingFormProps {
  storeId: string;
  existingRating?: Rating | null;
  onClose: () => void;
  onSuccess: () => void;
}

const RatingForm: React.FC<RatingFormProps> = ({
  storeId,
  existingRating,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(existingRating?.score || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const mutation = useMutation({
    mutationFn: async () => {
      if (existingRating) {
        const response = await api.put(`/ratings/${existingRating.id}`, { score: rating });
        return response.data;
      } else {
        const response = await api.post('/ratings', { storeId, score: rating });
        return response.data;
      }
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: unknown) => {
      setError(getErrorMessage(error, 'Failed to submit rating'));
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleMouseEnter = (value: number) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {existingRating ? 'Update Rating' : 'Rate Store'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRatingClick(value)}
                  onMouseEnter={() => handleMouseEnter(value)}
                  onMouseLeave={handleMouseLeave}
                  className="focus:outline-none transition-transform hover:scale-110"
                  aria-label={`Rate ${value} stars`}
                >
                  <Star
                    className={`h-8 w-8 ${
                      value <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {rating > 0 && `Selected: ${rating} star${rating > 1 ? 's' : ''}`}
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={mutation.isPending || rating === 0}
            >
              {mutation.isPending ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingForm;