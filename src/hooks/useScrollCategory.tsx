import { useState, useEffect, useCallback } from 'react';

interface ScrollCategoryOptions {
  categories: string[];
  rootMargin?: string;
  threshold?: number;
}

export const useScrollCategory = ({ 
  categories, 
  rootMargin = '-20% 0px -80% 0px',
  threshold = 0.1 
}: ScrollCategoryOptions) => {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || '');
  const [observers, setObservers] = useState<Map<string, IntersectionObserver>>(new Map());

  const scrollToCategory = useCallback((categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const headerHeight = 146; // Height of sticky headers (73px + 73px)
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const observeCategory = useCallback((categoryId: string, element: HTMLElement) => {
    // Clean up existing observer for this category
    const existingObserver = observers.get(categoryId);
    if (existingObserver) {
      existingObserver.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(categoryId);
          }
        });
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(element);
    
    setObservers(prev => new Map(prev.set(categoryId, observer)));

    return () => {
      observer.disconnect();
      setObservers(prev => {
        const newMap = new Map(prev);
        newMap.delete(categoryId);
        return newMap;
      });
    };
  }, [rootMargin, threshold, observers]);

  useEffect(() => {
    return () => {
      // Cleanup all observers on unmount
      observers.forEach(observer => observer.disconnect());
    };
  }, [observers]);

  return {
    activeCategory,
    scrollToCategory,
    observeCategory
  };
};