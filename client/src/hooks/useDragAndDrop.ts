import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BuilderComponent } from '@/lib/types';
import { DEFAULT_COMPONENT_PROPS } from '@/lib/constants';

export const useDragAndDrop = () => {
  const [components, setComponents] = useState<BuilderComponent[]>([]);

  const handleDrop = useCallback((item: { type: string }) => {
    const id = uuidv4();
    const newComponent: BuilderComponent = {
      id,
      type: item.type as any,
      props: DEFAULT_COMPONENT_PROPS[item.type as keyof typeof DEFAULT_COMPONENT_PROPS] || {},
      children: []
    };
    
    setComponents(prevComponents => [...prevComponents, newComponent]);
    return id;
  }, []);
  
  const updateComponent = useCallback((id: string, updates: Partial<BuilderComponent>) => {
    setComponents(prevComponents => 
      prevComponents.map(component => 
        component.id === id 
          ? { ...component, ...updates }
          : component
      )
    );
  }, []);
  
  const removeComponent = useCallback((id: string) => {
    setComponents(prevComponents => 
      prevComponents.filter(component => component.id !== id)
    );
  }, []);
  
  const moveComponent = useCallback((dragIndex: number, hoverIndex: number) => {
    setComponents(prevComponents => {
      const result = [...prevComponents];
      const [removed] = result.splice(dragIndex, 1);
      result.splice(hoverIndex, 0, removed);
      return result;
    });
  }, []);
  
  return {
    components,
    setComponents,
    handleDrop,
    updateComponent,
    removeComponent,
    moveComponent
  };
};
