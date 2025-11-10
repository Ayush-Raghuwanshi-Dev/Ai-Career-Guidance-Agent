"use client"
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Report from '../_components/Report';
import { Skeleton } from '@/components/ui/skeleton';

function AiResumeAnalyzer() {
  const { recordId } = useParams();
  const [pdfUrl, setPdfUrl] = useState<string | undefined>();
  const [aiReport, setAiReport] = useState<any>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    recordId && GetResumeAnalyzerRecord();
  }, [recordId]);

  const GetResumeAnalyzerRecord = async () => {
    try {
      setLoading(true);
      const result = await axios.get('/api/history?recordId=' + recordId);
      console.log(result.data);
      setPdfUrl(result.data?.metaData);
      setAiReport(result.data?.content);
    } catch (error) {
      console.error('Error fetching record:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='w-full'>
      {loading ? (
        <div>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-[300px] w-full rounded" />
        </div>
      ) : (
        <Report aiReport={aiReport} />
      )}
    </div>
  );
}

export default AiResumeAnalyzer;