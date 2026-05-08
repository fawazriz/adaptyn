import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import type { ResumeVersion } from "@/components/resumes/types"

interface ResumeDetailPanelProps {
  resume: ResumeVersion
}

export function ResumeDetailPanel({ resume }: ResumeDetailPanelProps) {
  return (
    <Card className="h-fit border border-border/70">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm">Selected resume details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium">{resume.name}</p>
            <span className="text-xs text-muted-foreground">{resume.version}</span>
          </div>
        </div>

        <Tabs defaultValue="history" className="w-full">
          <TabsList variant="line">
            <TabsTrigger value="history">Version history</TabsTrigger>
            <TabsTrigger value="applications">Linked applications</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-3">
            {resume.versionHistory.map((historyItem) => (
              <div key={historyItem.id} className="rounded-md border border-border/60 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{historyItem.version}</span>
                  <span className="text-muted-foreground">{historyItem.updatedAt}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{historyItem.summary}</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="applications" className="space-y-3">
            {resume.linkedApplications.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No linked applications for this version yet.
              </p>
            ) : (
              resume.linkedApplications.map((application, index) => (
                <div key={application.id}>
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-medium text-foreground">{application.company}</p>
                      <p className="text-muted-foreground">{application.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground">{application.stage}</p>
                      <p className="text-muted-foreground">{application.appliedAt}</p>
                    </div>
                  </div>
                  {index < resume.linkedApplications.length - 1 && (
                    <Separator className="mt-3" />
                  )}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="notes">
            <p className="text-xs leading-5 text-muted-foreground">{resume.notes}</p>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end">
          <Button asChild>
            <Link href={`/dashboard/resumes/${resume.id}`}>Open editor</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
