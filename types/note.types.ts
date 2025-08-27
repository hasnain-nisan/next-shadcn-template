// import { CreateNoteFormData } from "@/libs/validations/createNote.schema";
import React from "react";
import { Control, FieldErrors } from "react-hook-form";

export interface Note {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  color: string;
}

export interface NoteCardProps {
  note: Note;
  onToggleFavorite: (noteId: number) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, noteId: number) => void;
}

export interface NotesGridProps {
  notes: Note[];
  onToggleFavorite: (noteId: number) => void;
  onNoteMenuOpen: (
    event: React.MouseEvent<HTMLElement>,
    noteId: number
  ) => void;
}

export interface NotesHeaderProps {
  notes: Note[];
  filteredNotes: Note[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onFilterMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

export interface EmptyStateProps {
  searchTerm: string;
  selectedCategory: string;
  onCreateNote: () => void;
}

export interface FilterMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onSortChange: (sortBy: string) => void;
}

export interface NoteActionsMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  selectedNoteId: number | null;
}

export const mockNotes: Note[] = [
  {
    id: 1,
    title: "Project Planning Meeting",
    excerpt:
      "Discussed the roadmap for Q2 and assigned tasks to team members. Key decisions made regarding...",
    content: "Full content of the note...",
    coverImage: "https://picsum.photos/seed/project-planning/400/200",
    category: "Work",
    tags: ["meeting", "planning", "Q2"],
    author: "John Doe",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-16",
    isFavorite: true,
    color: "#e3f2fd",
  },
  {
    id: 2,
    title: "Recipe: Homemade Pizza",
    excerpt:
      "A delicious homemade pizza recipe with crispy crust and fresh toppings. Perfect for weekend cooking...",
    content: "Full recipe content...",
    coverImage: "https://picsum.photos/seed/pizza-recipe/400/200",
    category: "Personal",
    tags: ["recipe", "cooking", "pizza"],
    author: "John Doe",
    createdAt: "2024-01-14",
    updatedAt: "2024-01-14",
    isFavorite: false,
    color: "#fff3e0",
  },
  {
    id: 3,
    title: "Book Notes: The Lean Startup",
    excerpt:
      "Key insights from Eric Ries' book about building successful startups through validated learning...",
    content: "Detailed book notes...",
    coverImage: "https://picsum.photos/seed/lean-startup/400/200",
    category: "Learning",
    tags: ["book", "startup", "business"],
    author: "John Doe",
    createdAt: "2024-01-13",
    updatedAt: "2024-01-15",
    isFavorite: true,
    color: "#f3e5f5",
  },
  {
    id: 4,
    title: "Travel Itinerary: Japan 2024",
    excerpt:
      "Complete travel plan for 2-week trip to Japan including cities, accommodations, and must-visit places...",
    content: "Detailed travel itinerary...",
    coverImage: "https://picsum.photos/seed/japan-itinerary/400/200",
    category: "Travel",
    tags: ["travel", "japan", "itinerary"],
    author: "John Doe",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-13",
    isFavorite: false,
    color: "#e8f5e8",
  },
  {
    id: 5,
    title: "Workout Routine",
    excerpt:
      "Weekly workout schedule with exercises, sets, and reps. Focus on strength training and cardio...",
    content: "Detailed workout plan...",
    coverImage: "https://picsum.photos/seed/workout-plan/400/200",
    category: "Health",
    tags: ["fitness", "workout", "health"],
    author: "John Doe",
    createdAt: "2024-01-11",
    updatedAt: "2024-01-12",
    isFavorite: true,
    color: "#fce4ec",
  },
  {
    id: 6,
    title: "Investment Research",
    excerpt:
      "Analysis of potential investment opportunities in tech stocks and market trends for 2024...",
    content: "Investment analysis content...",
    coverImage: "https://picsum.photos/seed/tech-investment/400/200",
    category: "Finance",
    tags: ["investment", "stocks", "finance"],
    author: "John Doe",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-11",
    isFavorite: false,
    color: "#e1f5fe",
  },
];

export const categories = [
  "All",
  "Work",
  "Personal",
  "Learning",
  "Travel",
  "Health",
  "Finance",
  "Programming",
];

export interface CreateNoteHeaderProps {
  onBack: () => void;
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  onSave: () => void;
}

// export interface NoteFormProps {
//   control: Control<CreateNoteFormData>;
//   errors: FieldErrors<CreateNoteFormData>;
// }

export interface TagsSectionProps {
  tags: string[];
  newTag: string;
  onNewTagChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}
