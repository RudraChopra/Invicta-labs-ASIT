import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ConsultingHub() {
  return (
    <div className="p-6 md:p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-purple-600" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            AI Consulting Hub
          </h1>
          <p className="text-xl text-slate-600 mt-4">
            Apply your skills to real-world business challenges.
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-800">
              Exclusive to Expert Tier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-6">
              The Consulting Hub is where our Expert Tier members connect with businesses seeking AI solutions. Gain hands-on experience, build your professional portfolio, and earn revenue by working on live projects.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-700">Real-World Projects</h4>
                  <p className="text-sm text-slate-600">Access a marketplace of consulting opportunities from our industry partners.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-700">Industry Mentorship</h4>
                  <p className="text-sm text-slate-600">Schedule one-on-one sessions with seasoned AI professionals.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-700">Revenue Sharing</h4>
                  <p className="text-sm text-slate-600">Get compensated for your contributions to successful client projects.</p>
                </div>
              </div>
            </div>
            <Link to={createPageUrl("Subscription")}>
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold">
                <Zap className="w-4 h-4 mr-2" />
                Upgrade to Expert
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}