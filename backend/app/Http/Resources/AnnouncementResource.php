<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnnouncementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $userId = auth()->id();

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'group_id' => $this->group_id,
            'title' => $this->title,
            'content' => $this->content,
            'priority' => $this->priority,
            'priority_label' => $this->priority_label,
            'type' => $this->type,
            'type_label' => $this->type_label,
            'is_pinned' => $this->is_pinned,
            'is_published' => $this->is_published,
            'is_expired' => $this->is_expired,
            'is_active' => $this->is_active,
            'is_read' => $userId ? $this->isReadBy($userId) : null,
            'published_at' => $this->published_at?->toISOString(),
            'expires_at' => $this->expires_at?->toISOString(),
            'reads_count' => $this->reads_count,
            'author' => new UserResource($this->whenLoaded('author')),
            'group' => new GroupResource($this->whenLoaded('group')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
