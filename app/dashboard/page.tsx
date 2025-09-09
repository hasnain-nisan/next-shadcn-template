"use client";

import { SectionCards } from "@/components/section-cards";
import { ChartInterviewTrend } from "@/components/chart-area-interactive";
import { ServiceFactory } from "@/services/ServiceFactory";
import { useEffect, useMemo, useState } from "react";
import { Client } from "@/types/client.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import Link from "next/link";
import { AnalyticsType } from "@/types/dashboard.types";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [analytics, setAnalytics] = useState<AnalyticsType>({
    totalInterviews: 0,
    completedInterviews: 0,
    activeProjects: 0,
    engagedClients: 0,
    interviewTrend: [],
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("all");
  const [searchTermClient, setSearchTermClient] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const fetchClients = async () => {
    try {
      const clientService = ServiceFactory.getClientService();
      const result = await clientService.getAllClients({
        page: 1,
        limit: Number.MAX_SAFE_INTEGER,
        sortField: undefined,
        sortOrder: undefined,
        name: undefined,
        clientCode: undefined,
        deletedStatus: "false",
      });
      setClients(result.items);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.name.toLowerCase().includes(searchTermClient.toLowerCase())
    );
  }, [searchTermClient, clients]);

  const fetchAnalytics = async () => {
    try {
      const dashboardService = ServiceFactory.getDashboardService();
      const result = await dashboardService.getAnalytics({
        clientId,
        fromDate: startDate || undefined,
        toDate: endDate || undefined,
      });
      console.log(result);

      setAnalytics(result);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [clientId, startDate, endDate]);

  return (
    <div className="">
      <div className="flex items-center gap-2 text-sm text-muted-foreground pb-5 px-4 lg:px-6">
        <Link href="/dashboard" className="hover:text-foreground font-medium">
          Dashboard
        </Link>
      </div>
      <div className="w-full mb-5 px-4 lg:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:gap-6">
          <div className="flex flex-col lg:flex-1">
            <label
              htmlFor="clientId"
              className="text-sm text-muted-foreground mb-1"
            >
              Client
            </label>
            <Select
              value={clientId}
              onValueChange={(value) => setClientId(value)}
            >
              <SelectTrigger id="clientId" className="w-full text-sm h-[36px]">
                <SelectValue placeholder="Select a client..." />
              </SelectTrigger>
              <SelectContent
                className="max-h-[300px] overflow-y-auto w-full"
                style={{ width: "var(--radix-select-trigger-width)" }}
              >
                <div className="px-2 py-2 sticky top-[-5px] bg-background z-10">
                  <Input
                    placeholder="Search clients..."
                    value={searchTermClient}
                    onChange={(e) => setSearchTermClient(e.target.value)}
                    className="text-sm"
                  />
                </div>
                {/* All Clients Option */}
                <SelectItem value="all">All Clients</SelectItem>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No clients found
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col lg:flex-1">
            <label
              htmlFor="date"
              className="text-sm text-muted-foreground mb-1"
            >
              Date
            </label>
            <div className="flex items-center gap-2">
              <DateRangePicker
                startDate={startDate ? startDate.toISOString() : null}
                setStartDate={(date) =>
                  setStartDate(date ? new Date(date) : undefined)
                }
                endDate={endDate ? endDate.toISOString() : null}
                setEndDate={(date) =>
                  setEndDate(date ? new Date(date) : undefined)
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <SectionCards
          totalInterviews={analytics.totalInterviews}
          completedInterviews={analytics.completedInterviews}
          activeProjects={analytics.activeProjects}
          engagedClients={analytics.engagedClients}
        />

        <div className="px-4 lg:px-6">
          <ChartInterviewTrend interviewTrend={analytics.interviewTrend} />
        </div>
      </div>
    </div>
  );
}
