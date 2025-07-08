import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MobileMenuProps {
  user: any;
  userRole: string | null;
  showAdminAccess: boolean;
  onSignOut: () => void;
  onNavigateToAuth: () => void;
}

const MobileMenu = ({ user, userRole, showAdminAccess, onSignOut, onNavigateToAuth }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="text-gray-300">
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px] bg-black/95 border-purple-500/30">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-white">Меню</h2>
              <Button variant="ghost" size="sm" onClick={closeMenu}>
                <X size={16} />
              </Button>
            </div>
            
            <nav className="space-y-4 flex-1">
              <Link 
                to="/" 
                className="block py-3 px-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-purple-500/10"
                onClick={closeMenu}
              >
                Главная
              </Link>
              <Link 
                to="/categories" 
                className="block py-3 px-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-purple-500/10"
                onClick={closeMenu}
              >
                Категории
              </Link>
              <Link 
                to="/podcasts" 
                className="block py-3 px-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-purple-500/10"
                onClick={closeMenu}
              >
                Подкасты
              </Link>
              <Link 
                to="/stats" 
                className="block py-3 px-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-purple-500/10"
                onClick={closeMenu}
              >
                Статистика
              </Link>
              
              {showAdminAccess && userRole === 'admin' && (
                <Link 
                  to="/admin" 
                  className="block py-3 px-2 text-orange-300 hover:text-orange-200 transition-colors rounded-lg hover:bg-orange-500/10 animate-pulse"
                  onClick={closeMenu}
                >
                  🔧 Управление
                </Link>
              )}
            </nav>
            
            <div className="mt-auto pt-6 border-t border-purple-500/20">
              {user ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-300">
                    Привет, {user.email}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-red-500/50 text-red-300 hover:bg-red-500/10"
                    onClick={() => {
                      onSignOut();
                      closeMenu();
                    }}
                  >
                    Выйти
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                  onClick={() => {
                    onNavigateToAuth();
                    closeMenu();
                  }}
                >
                  Войти
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;