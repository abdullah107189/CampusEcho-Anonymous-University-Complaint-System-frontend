import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { useSubmitComplaintMutation } from '../../lib/api/complaintApi';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../components/ui/card';

import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

/* =========================================================
   ZOD SCHEMA
========================================================= */

const complaintSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(150, 'Title must not exceed 150 characters'),

  category: z.enum(
    [
      'Academic',
      'Facilities',
      'Administrative',
      'Hostel',
      'Transport',
      'IT_Services',
      'Library',
      'Sports',
      'Cafeteria',
      'Other',
    ],
    {
      message: 'Please select a category',
    }
  ),

  priority: z.enum(
    ['Low', 'Medium', 'High', 'Urgent'],
    {
      message: 'Please select a priority',
    }
  ),

  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

/* =========================================================
   COMPONENT
========================================================= */

export default function SubmitComplaint() {
  const navigate = useNavigate();

  const [submitComplaint, { isLoading }] =
    useSubmitComplaintMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),

    defaultValues: {
      title: '',
      category: undefined,
      priority: 'Medium',
      description: '',
    },

    mode: 'onSubmit',
  });

  /* =========================================================
     SUBMIT
  ========================================================= */

  const onSubmit = async (data: ComplaintFormData) => {
    try {
      const response = await submitComplaint(data).unwrap();

      const trackingId = response?.data?.trackingId;

      toast.success('Complaint submitted successfully!', {
        description: trackingId
          ? `Tracking ID: ${trackingId}`
          : 'Your complaint has been submitted successfully.',
      });

      reset();

      if (trackingId) {
        navigate(`/track/${trackingId}`);
      }
    } catch (error: any) {
      console.error('Submit complaint error:', error);

      let errorMessage =
        'Failed to submit complaint. Please try again.';

      /*
       * Backend message
       */
      if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      /*
       * Backend validation errors
       */
      else if (error?.data?.errors) {
        if (Array.isArray(error.data.errors)) {
          errorMessage = error.data.errors
            .map((item: any) => {
              if (typeof item === 'string') {
                return item;
              }

              return item?.message || 'Validation error';
            })
            .join(', ');
        } else if (
          typeof error.data.errors === 'object'
        ) {
          errorMessage = Object.values(error.data.errors)
            .flat()
            .map((item: any) => String(item))
            .join(', ');
        }
      }

      /*
       * RTK Query fetch error
       */
      else if (error?.error) {
        errorMessage = error.error;
      }

      /*
       * Generic JS error
       */
      else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error('Submission failed', {
        description: errorMessage,
      });
    }
  };

  /* =========================================================
     INVALID FORM
  ========================================================= */

  const onInvalid = () => {
    toast.error('Please fix the errors', {
      description:
        'Check the highlighted fields and try again.',
    });
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Submit a Complaint
          </CardTitle>

          <CardDescription>
            Provide details about the issue you are facing.
            We will investigate and resolve it as soon as
            possible.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="space-y-6"
          >
            {/* =================================================
                TITLE
            ================================================= */}

            <div className="space-y-2">
              <Label htmlFor="title">
                Title
              </Label>

              <Input
                id="title"
                placeholder="Brief summary of the issue"
                {...register('title')}
                aria-invalid={!!errors.title}
                className={
                  errors.title
                    ? 'border-destructive'
                    : ''
                }
              />

              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* =================================================
                CATEGORY + PRIORITY
            ================================================= */}

            <div className="grid md:grid-cols-2 gap-6">
              {/* CATEGORY */}

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category
                </Label>

                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className={
                          errors.category
                            ? 'border-destructive'
                            : ''
                        }
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="Academic">
                          Academic
                        </SelectItem>

                        <SelectItem value="Facilities">
                          Facilities
                        </SelectItem>

                        <SelectItem value="Administrative">
                          Administrative
                        </SelectItem>

                        <SelectItem value="Hostel">
                          Hostel
                        </SelectItem>

                        <SelectItem value="Transport">
                          Transport
                        </SelectItem>

                        <SelectItem value="IT_Services">
                          IT Services
                        </SelectItem>

                        <SelectItem value="Library">
                          Library
                        </SelectItem>

                        <SelectItem value="Sports">
                          Sports
                        </SelectItem>

                        <SelectItem value="Cafeteria">
                          Cafeteria
                        </SelectItem>

                        <SelectItem value="Other">
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.category && (
                  <p className="text-sm text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* PRIORITY */}

              <div className="space-y-2">
                <Label htmlFor="priority">
                  Priority
                </Label>

                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className={
                          errors.priority
                            ? 'border-destructive'
                            : ''
                        }
                      >
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="Low">
                          Low
                        </SelectItem>

                        <SelectItem value="Medium">
                          Medium
                        </SelectItem>

                        <SelectItem value="High">
                          High
                        </SelectItem>

                        <SelectItem value="Urgent">
                          Urgent
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.priority && (
                  <p className="text-sm text-destructive">
                    {errors.priority.message}
                  </p>
                )}
              </div>
            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <div className="space-y-2">
              <Label htmlFor="description">
                Description
              </Label>

              <Textarea
                id="description"
                placeholder="Provide as much detail as possible..."
                className={`min-h-[120px] ${
                  errors.description
                    ? 'border-destructive'
                    : ''
                }`}
                {...register('description')}
                aria-invalid={!!errors.description}
              />

              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* =================================================
                SUBMIT BUTTON
            ================================================= */}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading
                ? 'Submitting...'
                : 'Submit Complaint'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}