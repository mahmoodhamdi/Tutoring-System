<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'gender' => $this->gender,
            'avatar' => $this->avatar,
            'is_active' => $this->is_active,
            'email_verified_at' => $this->email_verified_at?->toISOString(),
            'phone_verified_at' => $this->phone_verified_at?->toISOString(),
            'profile' => $this->when($this->studentProfile, function () {
                return [
                    'id' => $this->studentProfile->id,
                    'grade_level' => $this->studentProfile->grade_level,
                    'school_name' => $this->studentProfile->school_name,
                    'address' => $this->studentProfile->address,
                    'emergency_contact_name' => $this->studentProfile->emergency_contact_name,
                    'emergency_contact_phone' => $this->studentProfile->emergency_contact_phone,
                    'notes' => $this->studentProfile->notes,
                    'enrollment_date' => $this->studentProfile->enrollment_date?->format('Y-m-d'),
                    'status' => $this->studentProfile->status,
                    'parent' => $this->when($this->studentProfile->parent, function () {
                        return [
                            'id' => $this->studentProfile->parent->id,
                            'name' => $this->studentProfile->parent->name,
                            'email' => $this->studentProfile->parent->email,
                            'phone' => $this->studentProfile->parent->phone,
                        ];
                    }),
                    'created_at' => $this->studentProfile->created_at?->toISOString(),
                    'updated_at' => $this->studentProfile->updated_at?->toISOString(),
                ];
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'pivot' => $this->when($this->pivot, function () {
                return [
                    'joined_at' => $this->pivot->joined_at,
                    'left_at' => $this->pivot->left_at,
                    'is_active' => (bool) $this->pivot->is_active,
                    'notes' => $this->pivot->notes,
                ];
            }),
        ];
    }
}
