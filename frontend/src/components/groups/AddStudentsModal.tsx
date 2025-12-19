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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-right shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="absolute left-0 top-0 hidden pl-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={handleClose}
                  >
                    <span className="sr-only">إغلاق</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="px-4 pb-4 pt-5 sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                      <UserPlusIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="mt-3 text-center sm:mr-4 sm:mt-0 sm:text-right flex-1">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        إضافة طلاب
                      </Dialog.Title>
                      <p className="text-sm text-gray-500 mt-1">
                        المتاح: {availableSpots} مكان | المحدد: {selectedStudents.length}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        placeholder="البحث عن طالب..."
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="joined_at"
                        className="block text-sm font-medium text-gray-700"
                      >
                        تاريخ الانضمام
                      </label>
                      <input
                        type="date"
                        id="joined_at"
                        value={joinedAt}
                        onChange={(e) => setJoinedAt(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>

                    <div className="max-h-60 overflow-y-auto border rounded-md divide-y">
                      {isLoading ? (
                        <div className="p-4 text-center text-gray-500">جاري التحميل...</div>
                      ) : availableStudents.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          {search ? 'لا توجد نتائج' : 'لا يوجد طلاب متاحين'}
                        </div>
                      ) : (
                        availableStudents.map((student: Student) => (
                          <label
                            key={student.id}
                            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 ${
                              selectedStudents.includes(student.id) ? 'bg-primary-50' : ''
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
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{student.name}</p>
                              <p className="text-xs text-gray-500">{student.phone}</p>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={selectedStudents.length === 0 || isAdding}
                    className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-50 sm:w-auto"
                  >
                    {isAdding ? 'جاري الإضافة...' : `إضافة (${selectedStudents.length})`}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
