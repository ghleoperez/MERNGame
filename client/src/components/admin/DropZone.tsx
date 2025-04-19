import { useRef } from "react";
import { useDrop } from "react-dnd";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onDrop: (item: any) => void;
  className?: string;
  children?: React.ReactNode;
}

const DropZone = ({ onDrop, className, children }: DropZoneProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'BUILDER_COMPONENT',
    drop: (item, monitor) => {
      onDrop(item);
      return undefined;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [onDrop]);

  drop(ref);

  return (
    <div
      ref={ref}
      className={cn(
        "border-2 border-dashed rounded-lg transition-colors",
        isOver && canDrop ? "border-primary bg-primary/5" : "border-border",
        className
      )}
    >
      {children}
    </div>
  );
};

export default DropZone;
