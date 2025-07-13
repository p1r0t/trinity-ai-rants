import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Send, Trash2, Edit } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  article_id: string;
  user_email?: string;
}

interface CommentSystemProps {
  articleId: string;
  user: User | null;
}

const CommentSystem = ({ articleId, user }: CommentSystemProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadComments();
  }, [articleId]);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('article_id', articleId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Добавляем email пользователей
      const commentsWithUsers = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('email')
            .eq('user_id', comment.user_id)
            .single();
          
          return {
            ...comment,
            user_email: profileData?.email || 'Пользователь'
          };
        })
      );

      setComments(commentsWithUsers);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const addComment = async () => {
    if (!user || !newComment.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          article_id: articleId,
          user_id: user.id
        });

      if (error) throw error;

      setNewComment('');
      await loadComments();
      
      toast({
        title: "Комментарий добавлен",
        description: "Ваш комментарий успешно опубликован",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить комментарий",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const editComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .update({ 
          content: editContent.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setEditingId(null);
      setEditContent('');
      await loadComments();
      
      toast({
        title: "Комментарий обновлен",
        description: "Изменения сохранены",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить комментарий",
        variant: "destructive",
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user?.id);

      if (error) throw error;

      await loadComments();
      
      toast({
        title: "Комментарий удален",
        description: "Комментарий успешно удален",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить комментарий",
        variant: "destructive",
      });
    }
  };

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <Card className="bg-card/80 border-border/50 glass-effect">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <MessageSquare className="text-primary" size={20} />
          <h3 className="text-lg font-semibold text-foreground">
            Комментарии ({comments.length})
          </h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        {user ? (
          <div className="space-y-3">
            <Textarea
              placeholder="Поделитесь своими мыслями..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] bg-background/50 border-border/50"
            />
            <div className="flex justify-end">
              <Button
                onClick={addComment}
                disabled={loading || !newComment.trim()}
                className="hover-lift"
              >
                <Send size={16} className="mr-2" />
                {loading ? 'Отправка...' : 'Отправить'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 bg-accent/20 rounded-lg border border-border/30">
            <p className="text-muted-foreground mb-2">
              Войдите в систему, чтобы оставить комментарий
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/auth'}>
              Войти
            </Button>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>Пока нет комментариев</p>
              <p className="text-sm">Будьте первым, кто оставит комментарий!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id} className="bg-background/30 border-border/30">
                <CardContent className="pt-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm">
                        {getUserInitials(comment.user_email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground text-sm">
                            {comment.user_email?.split('@')[0] || 'Пользователь'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), {
                              addSuffix: true,
                              locale: ru
                            })}
                          </span>
                          {comment.updated_at !== comment.created_at && (
                            <span className="text-xs text-muted-foreground italic">
                              (изменено)
                            </span>
                          )}
                        </div>
                        
                        {user?.id === comment.user_id && (
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingId(comment.id);
                                setEditContent(comment.content);
                              }}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                            >
                              <Edit size={12} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteComment(comment.id)}
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 size={12} />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {editingId === comment.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[60px] text-sm"
                          />
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => editComment(comment.id)}
                              disabled={!editContent.trim()}
                            >
                              Сохранить
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingId(null);
                                setEditContent('');
                              }}
                            >
                              Отмена
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentSystem;