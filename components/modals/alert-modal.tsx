"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface ALertModalProps {
  isOpen: boolean;
  onCLose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal: React.FC<ALertModalProps> = ({
  isOpen,
  onCLose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Are You Sure"
      description="This action cannot be undone"
      isOpen={isOpen}
      onClose={onCLose}
    >
      <div className="p-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant={"outline"} onClick={onCLose}>
          Cancel
        </Button>
        <Button disabled={loading} variant={"destructive"} onClick={onConfirm}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};
