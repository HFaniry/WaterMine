import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type Group = {
  id: string
  name: string
}

type GroupListProps = {
  groups: Group[]
  selectedGroupId: string
  onSelectGroup: (groupId: string) => void
}

export function GroupList({ groups, selectedGroupId, onSelectGroup }: GroupListProps) {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle>Groupes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {groups.map((group) => (
            <Button
              key={group.id}
              variant="ghost"
              className={cn(
                "w-full justify-start font-normal",
                group.id === selectedGroupId && "bg-muted"
              )}
              onClick={() => onSelectGroup(group.id)}
            >
              {group.name}
            </Button>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

