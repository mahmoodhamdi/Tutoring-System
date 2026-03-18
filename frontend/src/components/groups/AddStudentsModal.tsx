'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, MagnifyingGlassIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { useStudents } from '@/hooks/useStudents';
import { Student } from '@/types/student';

interface AddStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (studentIds: number[], joinedAt?: string) => void;
  existingStudentIds: number[];
  isAdding?: boolean;
  maxStudents: number;
  currentCount: number;
}

export function AddStudentsModal({
  isOpen,
  onClose,
  onAdd,
  existingStudentIds,
  isAdding,
  maxStudents,
  currentCount,
}: AddStudentsModalProps) {
  const [search, setSearch] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [joinedAt, setJoinedAt] = useState(new Date().toISOString().split('T')[0]);

  const { data: studentsData, isLoading } = useStudents({
    search,
    per_page: 50,
    status: 'active',
  });

  const availableStudents =
    studentsData?.data.filter((s: Student) => !existingStudentIds.includes(s.id)) || [];

  const availableSpots = maxStudents - currentCount;
  const canAddMore = selectedStudents.length < availableSpots;

  const toggleStudent = (studentId: number) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else if (canAddMore) {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleSubmit = () => {
    if (selectedStudents.length > 0) {
      onAdd(selectedStudents, joinedAt);
      setSelectedStudents([]);
      setSearch('');
    }
  };

  const handleClose = () => {
    setSelectedStudents([]);
    setSearch('');
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white text-right shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                {/* Close button */}
                <div className="absolute left-0 top-0 hidden pl-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-lg bg-white text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 p-1 transition-all duration-200"
                    onClick={handleClose}
                  >
                    <span className="sr-only">إغلاق</span>
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="px-6 pb-4 pt-5 sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                      <UserPlusIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="mt-3 text-center sm:mr-4 sm:mt-0 sm:text-right flex-1">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-bold text-neutral-900"
                      >
                        إضافة طلاب
                      </Dialog.Title>
                      <p className="text-sm text-neutral-500 mt-1">
                        المتاح:{' '}
                        <span className="font-semibold text-primary-600">{availableSpots}</span>{' '}
                        مكان | المحدد:{' '}
                        <span className="font-semibold text-primary-600">{selectedStudents.length}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    {/* Search */}
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
                      </div>
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="block w-full rounded-xl border border-neutral-200 bg-white py-2 pr-10 pl-3 text-neutral-800 text-sm shadow-sm placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200"
                        placeholder="البحث عن طالب..."
                      />
                    </div>

                    {/* Join date */}
                    <div>
                      <label
                        htmlFor="joined_at"
                        className="block text-sm font-medium text-neutral-700 mb-1"
                      >
                        تاريخ الانضمام
                      </label>
                      <input
                        type="date"
                        id="joined_at"
                        value={joinedAt}
                        onChange={(e) => setJoinedAt(e.target.value)}
                        className="mt-1 block w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-sm shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all duration-200"
                      />
                    </div>

                    {/* Students list */}
                    <div className="max-h-60 overflow-y-auto border border-neutral-100 rounded-xl divide-y divide-neutral-100">
                      {isLoading ? (
                        <div className="p-4 text-center text-neutral-500 text-sm">جاري التحميل...</div>
                      ) : availableStudents.length === 0 ? (
                        <div className="p-4 text-center text-neutral-500 text-sm">
                          {search ? 'لا توجد نتائج' : 'لا يوجد طلاب متاحين'}
                        </div>
                      ) : (
                        availableStudents.map((student: Student) => (
                          <label
                            key={student.id}
                            className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                              selectedStudents.includes(student.id)
                                ? 'bg-primary-50'
                                : 'hover:bg-neutral-50'
                            } ${
                              !canAddMore && !selectedStudents.includes(student.id)
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student.id)}
                              onChange={() => toggleStudent(student.id)}
                              disabled={!canAddMore && !selectedStudents.includes(student.id)}
                              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-neutral-900">{student.name}</p>
                              <p className="text-xs text-neutral-500">{student.phone}</p>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 border-t border-neutral-100 px-6 py-4 sm:flex sm:flex-row-reverse gap-3">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={selectedStudents.length === 0 || isAdding}
                    className="inline-flex w-full justify-center rounded-xl bg-gradient-to-l from-primary-600 to-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-primary-700 hover:to-primary-600 transition-all duration-200 disabled:opacity-50 sm:w-auto"
                  >
                    {isAdding ? 'جاري الإضافة...' : `إضافة (${selectedStudents.length})`}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm ring-1 ring-inset ring-neutral-200 hover:bg-neutral-50 transition-all duration-200 sm:mt-0 sm:w-auto"
                  >
                    إلغاء
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default AddStudentsModal;
