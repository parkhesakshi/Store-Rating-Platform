import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/Select';
import { getErrorMessage } from '../lib/error-handler';

const userSchema = z.object({
  name: z.string()
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name must be at most 60 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, 
      'Password must contain at least one uppercase letter and one special character'),
  address: z.string().max(400, 'Address must be at most 400 characters'),
  role: z.enum(['USER', 'ADMIN', 'STORE_OWNER']),
});

type UserFormData = z.infer<typeof userSchema>;

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'USER',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      const response = await api.post('/users', data);
      return response.data;
    },
    onSuccess: () => {
      reset();
      onSuccess();
    },
  });

  const onSubmit = (data: UserFormData) => {
    mutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name')}
              error={errors.name?.message}
              placeholder="Enter full name (20-60 characters)"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="Enter email address"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="8-16 characters with uppercase and special char"
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register('address')}
              error={errors.address?.message}
              placeholder="Enter address (max 400 characters)"
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select 
              onValueChange={(value) => setValue('role', value as 'USER' | 'ADMIN' | 'STORE_OWNER')}
              defaultValue="USER"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="STORE_OWNER">Store Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mutation.isError && (
            <div className="text-red-600 text-sm">
              {getErrorMessage(mutation.error, 'Failed to create user')}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;