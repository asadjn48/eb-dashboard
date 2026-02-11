
import React, { useEffect, useState, useMemo } from 'react';
import { 
  Search, Plus, Edit2, Trash2, StickyNote, Calendar 
} from 'lucide-react';

// UI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Custom Components & API
import { NoteModal } from '@/components/notes/NoteModal';
import { noteAPI } from '@/services/noteService';
import { formatDate } from '@/utils/formatters';
import type { Note, NoteCategory } from '@/types';
import { cn } from '@/lib/utils';

const CATEGORY_COLORS: Record<NoteCategory, string> = {
  Work: 'bg-blue-50 text-blue-700 border-blue-100',
  Personal: 'bg-green-50 text-green-700 border-green-100',
  Ideas: 'bg-purple-50 text-purple-700 border-purple-100',
  Urgent: 'bg-red-50 text-red-700 border-red-100',
  'To-Do': 'bg-orange-50 text-orange-700 border-orange-100',
};

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // 1. Fetch Data
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const data = await noteAPI.getAll();
      setNotes(data);
    } catch (error) {
      console.error('Failed to load notes', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Filter Logic
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || note.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [notes, searchQuery, categoryFilter]);

  // 3. Handlers
  const handleSave = async (data: Partial<Note>) => {
    try {
      if (editingNote) {
        await noteAPI.update(editingNote.id, data);
        setNotes(prev => prev.map(n => n.id === editingNote.id ? { ...n, ...data } as Note : n));
      } else {
        const newNote = await noteAPI.add({
          title: data.title!,
          content: data.content!,
          category: data.category!,
          date: new Date().toISOString(),
        });
        setNotes(prev => [newNote, ...prev]);
      }
      setIsModalOpen(false);
      setEditingNote(undefined);
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this note?")) {
      await noteAPI.delete(id);
      setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  const openNewModal = () => {
    setEditingNote(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notes & Ideas</h1>
          <p className="text-gray-500 mt-1">Capture thoughts, meetings, and to-dos.</p>
        </div>
        <Button 
          onClick={openNewModal} 
          className="bg-[var(--primary)] hover:opacity-90 text-white shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Note
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search notes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Work">Work</SelectItem>
            <SelectItem value="Personal">Personal</SelectItem>
            <SelectItem value="Ideas">Ideas</SelectItem>
            <SelectItem value="Urgent">Urgent</SelectItem>
            <SelectItem value="To-Do">To-Do</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Loading notes...</div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <StickyNote className="w-12 h-12 mb-2 opacity-20" />
          <p>No notes found. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="group hover:shadow-md transition-all duration-300 border-gray-100 flex flex-col">
              <CardHeader className="p-4 pb-2 space-y-2">
                <div className="flex justify-between items-start">
                  <Badge 
                    variant="outline" 
                    className={cn("font-normal border-0 px-2", CATEGORY_COLORS[note.category])}
                  >
                    {note.category}
                  </Badge>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditModal(note)}>
                      <Edit2 className="w-3 h-3 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-red-50" onClick={() => handleDelete(note.id)}>
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 leading-snug">
                  {note.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2 flex-1 flex flex-col justify-between">
                <p className="text-sm text-gray-600 line-clamp-4 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
                <div className="pt-4 mt-2 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {formatDate(note.date)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <NoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        initialData={editingNote} 
      />
    </div>
  );
};

export default Notes;