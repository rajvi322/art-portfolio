"use client";

import { useState } from "react";
import { User, Shield, Bell, Globe, Save } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-headline font-semibold text-text-header mb-2">Settings</h1>
        <p className="text-text-muted text-sm">Configure your portfolio appearance and administrative preferences.</p>
      </div>

      <div className="max-w-4xl space-y-8">
        {/* Profile Section */}
        <section className="bg-white border border-neutral/10 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-8 border-b border-neutral/10 flex items-center gap-4 bg-secondary/5">
            <div className="p-2 bg-accent/10 text-accent rounded-lg">
              <User size={20} />
            </div>
            <h3 className="font-headline text-lg font-semibold text-text-header">Artist Profile</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-label uppercase tracking-widest text-text-muted">Display Name</label>
              <input
                type="text"
                defaultValue="Arté Curator"
                className="w-full px-4 py-2.5 text-sm bg-secondary/10 border border-neutral/5 rounded focus:ring-1 focus:ring-accent outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-label uppercase tracking-widest text-text-muted">Email Address</label>
              <input
                type="email"
                defaultValue="curator@arte-gallery.com"
                className="w-full px-4 py-2.5 text-sm bg-secondary/10 border border-neutral/5 rounded focus:ring-1 focus:ring-accent outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-label uppercase tracking-widest text-text-muted">Bio Snippet</label>
              <textarea
                className="w-full px-4 py-2.5 text-sm bg-secondary/10 border border-neutral/5 rounded focus:ring-1 focus:ring-accent outline-none min-h-[100px] resize-none"
                placeholder="Briefly describe your artistic vision..."
              />
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-white border border-neutral/10 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-8 border-b border-neutral/10 flex items-center gap-4 bg-secondary/5">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
              <Globe size={20} />
            </div>
            <h3 className="font-headline text-lg font-semibold text-text-header">Global Preferences</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text-header">Public Portfolio</p>
                <p className="text-xs text-text-muted">Make your gallery visible to the world.</p>
              </div>
              <div className="w-12 h-6 bg-accent rounded-full relative p-1 cursor-pointer">
                <div className="w-4 h-4 bg-primary rounded-full absolute right-1"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text-header">Email Notifications</p>
                <p className="text-xs text-text-muted">Receive alerts for new inquiries.</p>
              </div>
              <div className="w-12 h-6 bg-neutral/20 rounded-full relative p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute left-1"></div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-8 py-3 bg-accent text-primary rounded-full font-label text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-accent/10">
            <Save size={16} />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
