import { useRef } from "react";
import { useDrop } from "react-dnd";
import { BuilderComponent } from "@/lib/types";
import DraggableComponent from "./DraggableComponent";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";

interface BuilderCanvasProps {
  components: BuilderComponent[];
  onDrop: (type: string) => string;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onUpdate: (id: string, updates: Partial<BuilderComponent>) => void;
  onRemove: (id: string) => void;
}

const BuilderCanvas = ({ 
  components, 
  onDrop, 
  onMove, 
  onUpdate, 
  onRemove 
}: BuilderCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'BUILDER_COMPONENT',
    drop: (item: { type: string }, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const containerRect = canvasRef.current?.getBoundingClientRect();
      
      if (clientOffset && containerRect) {
        // Calculate position relative to the canvas
        const position = {
          x: clientOffset.x - containerRect.left,
          y: clientOffset.y - containerRect.top
        };
        
        // Add the component at this position
        return {
          id: onDrop(item.type),
          position
        };
      }
      
      return { id: onDrop(item.type) };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  }), [onDrop]);

  // Connect the drop target to the canvas
  drop(canvasRef);

  return (
    <div 
      ref={canvasRef}
      className={cn(
        "bg-background rounded-lg border-2 border-dashed p-4 h-[calc(100vh-160px)] overflow-y-auto",
        isOver && canDrop ? "border-primary" : "border-border",
        components.length === 0 ? "flex flex-col items-center justify-center" : ""
      )}
    >
      {components.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <PlusCircle className="mx-auto h-12 w-12 mb-4" />
          <p className="text-lg">Drag and drop components here to build your layout</p>
          <p className="text-sm mt-2">Components will appear in the preview as they would in the actual interface</p>
        </div>
      ) : (
        <div className="space-y-4">
          {components.map((component, index) => (
            <DraggableComponent
              key={component.id}
              component={component}
              index={index}
              onMove={onMove}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BuilderCanvas;
