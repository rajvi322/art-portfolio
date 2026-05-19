"use client";

import React from "react";

interface AdminHeaderProps {
  title: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  description,
  actions,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 pb-6 border-b border-border">
      <div className="space-y-1">
        <h1 className="text-3xl font-headline font-bold text-text-header flex items-center gap-3">
          {title}
        </h1>
        {description && (
          <p className="text-text-muted text-sm leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center md:justify-end gap-3 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
