import { useMemo } from "react";
import { useDrag } from "react-dnd";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { BUILDER_COMPONENTS } from "@/lib/constants";
import {
  SquareDashedBottom,
  SquareStack,
  LayoutGrid,
  Gamepad,
  Image,
  Type,
  Square,
  ListTodo,
  Folder
} from "lucide-react";

interface ComponentLibraryProps {
  selectedCategory?: string;
  onSelectCategory: (category: string) => void;
}

const ComponentLibrary = ({ 
  selectedCategory = "Layout", 
  onSelectCategory 
}: ComponentLibraryProps) => {
  // Get unique categories
  const categories = useMemo(() => 
    Array.from(new Set(BUILDER_COMPONENTS.map(component => component.category))), 
    []
  );
  
  // Filter components by selected category
  const filteredComponents = useMemo(() => 
    BUILDER_COMPONENTS.filter(component => component.category === selectedCategory),
    [selectedCategory]
  );
  
  // Get icon for component
  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'section':
        return <SquareDashedBottom className="h-5 w-5" />;
      case 'container':
        return <SquareStack className="h-5 w-5" />;
      case 'grid':
        return <LayoutGrid className="h-5 w-5" />;
      case 'game-card':
        return <Gamepad className="h-5 w-5" />;
      case 'hero-banner':
        return <Image className="h-5 w-5" />;
      case 'text-block':
        return <Type className="h-5 w-5" />;
      case 'button':
        return <Square className="h-5 w-5" />;
      case 'form':
        return <ListTodo className="h-5 w-5" />;
      case 'tabs':
        return <Folder className="h-5 w-5" />;
      default:
        return <Square className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-muted rounded-lg border border-border p-4 h-[calc(100vh-160px)]">
      <h3 className="text-lg font-semibold mb-4">Components</h3>
      
      <div className="flex space-x-2 mb-4">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectCategory(category)}
            className="text-xs"
          >
            {category}
          </Button>
        ))}
      </div>
      
      <ScrollArea className="h-[calc(100vh-240px)]">
        <div className="space-y-3">
          {filteredComponents.map(component => (
            <DraggableItem
              key={component.type}
              type={component.type}
              label={component.label}
              icon={getComponentIcon(component.type)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

interface DraggableItemProps {
  type: string;
  label: string;
  icon: React.ReactNode;
}

const DraggableItem = ({ type, label, icon }: DraggableItemProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BUILDER_COMPONENT',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [type]);

  return (
    <div
      ref={drag}
      className={cn(
        "bg-card p-3 rounded border border-border cursor-move transition-colors hover:border-primary",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center">
        <span className="text-muted-foreground mr-3">
          {icon}
        </span>
        <span className="text-foreground">{label}</span>
      </div>
    </div>
  );
};

export default ComponentLibrary;
