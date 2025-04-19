import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { BuilderComponent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GripVertical, X, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface DraggableComponentProps {
  component: BuilderComponent;
  index: number;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onUpdate: (id: string, updates: Partial<BuilderComponent>) => void;
  onRemove: (id: string) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const DraggableComponent = ({ 
  component, 
  index, 
  onMove, 
  onUpdate, 
  onRemove 
}: DraggableComponentProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Setup drag functionality
  const [{ isDragging }, drag] = useDrag({
    type: 'COMPONENT',
    item: { index, id: component.id, type: component.type } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Setup drop functionality for reordering
  const [{ handlerId }, drop] = useDrop({
    accept: 'COMPONENT',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for performance.
      item.index = hoverIndex;
    },
  });

  // Connect drag and drop
  drag(drop(ref));

  // Render different component types
  const renderComponentPreview = () => {
    switch (component.type) {
      case 'section':
        return (
          <div className="bg-card/50 p-4 rounded-md border border-dashed border-border">
            <h3 className="text-lg font-medium mb-2">{component.props?.title || 'Section'}</h3>
            <p className="text-muted-foreground text-sm">{component.props?.description || 'Section content goes here'}</p>
          </div>
        );
      
      case 'game-card':
        return (
          <div className="bg-card rounded-md overflow-hidden border border-border">
            <div className="bg-muted h-32 flex items-center justify-center">
              <span className="text-muted-foreground">Game Image</span>
            </div>
            <div className="p-3">
              <h3 className="font-medium">{component.props?.title || 'Game Title'}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs px-2 py-1 bg-muted rounded border border-border text-muted-foreground">
                  {component.props?.category || 'Category'}
                </span>
                <Button size="sm" variant="default" className="h-7 w-7 p-0">
                  <span className="sr-only">Play</span>
                  ▶
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'button':
        return (
          <Button>
            {component.props?.label || 'Button'}
          </Button>
        );
      
      case 'text-block':
        return (
          <div className="p-2">
            <p className="text-foreground">
              {component.props?.content || 'Text block content'}
            </p>
          </div>
        );
      
      default:
        return (
          <div className="p-4 border border-dashed border-border rounded-md text-center">
            <p className="text-muted-foreground">
              {component.type.charAt(0).toUpperCase() + component.type.slice(1).replace('-', ' ')}
            </p>
          </div>
        );
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "bg-muted rounded-lg border border-border transition-opacity",
        isDragging && "opacity-50"
      )}
      data-handler-id={handlerId}
    >
      <Card>
        <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center">
            <div className="cursor-move px-1">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-base ml-2">
              {component.type.charAt(0).toUpperCase() + component.type.slice(1).replace('-', ' ')}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                // Toggle edit mode for this component
                console.log("Edit component", component.id);
                // This would typically open a form or modal to edit props
              }}
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onRemove(component.id)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {renderComponentPreview()}
          
          {/* Simple property editor */}
          <div className="mt-3 pt-3 border-t border-border">
            {component.type === 'section' && (
              <div className="space-y-2">
                <Input
                  placeholder="Section Title"
                  value={component.props?.title || ''}
                  onChange={(e) => 
                    onUpdate(component.id, { 
                      props: { ...component.props, title: e.target.value } 
                    })
                  }
                />
                <Textarea
                  placeholder="Section Description"
                  value={component.props?.description || ''}
                  onChange={(e) => 
                    onUpdate(component.id, { 
                      props: { ...component.props, description: e.target.value } 
                    })
                  }
                />
              </div>
            )}
            
            {component.type === 'game-card' && (
              <div className="space-y-2">
                <Input
                  placeholder="Game Title"
                  value={component.props?.title || ''}
                  onChange={(e) => 
                    onUpdate(component.id, { 
                      props: { ...component.props, title: e.target.value } 
                    })
                  }
                />
                <Input
                  placeholder="Category"
                  value={component.props?.category || ''}
                  onChange={(e) => 
                    onUpdate(component.id, { 
                      props: { ...component.props, category: e.target.value } 
                    })
                  }
                />
              </div>
            )}
            
            {component.type === 'button' && (
              <Input
                placeholder="Button Label"
                value={component.props?.label || ''}
                onChange={(e) => 
                  onUpdate(component.id, { 
                    props: { ...component.props, label: e.target.value } 
                  })
                }
              />
            )}
            
            {component.type === 'text-block' && (
              <Textarea
                placeholder="Text Content"
                value={component.props?.content || ''}
                onChange={(e) => 
                  onUpdate(component.id, { 
                    props: { ...component.props, content: e.target.value } 
                  })
                }
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DraggableComponent;
