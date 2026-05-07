import { IconFileText, IconLayersIntersect, IconLink, IconRosetteDiscountCheck } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ResumesStatsProps {
  totalResumes: number
  activeResumes: number
  linkedApplications: number
}

export function ResumesStats({
  totalResumes,
  activeResumes,
  linkedApplications,
}: ResumesStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card size="sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm text-muted-foreground">Total resumes</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-2xl font-semibold text-foreground">{totalResumes}</p>
          <IconFileText className="text-muted-foreground" size={18} />
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm text-muted-foreground">Active versions</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-2xl font-semibold text-foreground">{activeResumes}</p>
          <IconLayersIntersect className="text-muted-foreground" size={18} />
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm text-muted-foreground">Applications linked</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-2xl font-semibold text-foreground">{linkedApplications}</p>
          <IconLink className="text-muted-foreground" size={18} />
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm text-muted-foreground">Best performing version</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">Insufficient response data</p>
          <IconRosetteDiscountCheck className="text-muted-foreground" size={18} />
        </CardContent>
      </Card>
    </div>
  )
}
