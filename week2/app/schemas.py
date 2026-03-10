from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


# --- Note models ------------------------------------------------------------

class NoteCreate(BaseModel):
    content: str = Field(..., min_length=1)


class Note(BaseModel):
    id: int
    content: str
    created_at: str


# --- Action item / extraction models --------------------------------------

class ExtractPayload(BaseModel):
    text: str = Field(..., min_length=1)
    save_note: Optional[bool] = False


class ExtractedItem(BaseModel):
    id: int
    text: str


class ExtractResponse(BaseModel):
    note_id: Optional[int]
    items: List[ExtractedItem]


class ActionItem(BaseModel):
    id: int
    note_id: Optional[int]
    text: str
    done: bool
    created_at: str


class ActionItemUpdate(BaseModel):
    done: bool
