import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuizEntry } from '@/types/quiz';
import { deleteQuizEntry, exportToCSV } from '@/utils/localStorage';
import { Download, History, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface QuizTableProps {
  entries: QuizEntry[];
  onEntriesChange: () => void;
}

export const QuizTable = ({ entries, onEntriesChange }: QuizTableProps) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    deleteQuizEntry(id);
    onEntriesChange();
    toast({
      title: "Quiz Deleted",
      description: "Quiz entry has been removed from your records.",
    });
  };

  const handleExport = () => {
    if (entries.length === 0) {
      toast({
        title: "No Data",
        description: "No quiz entries to export.",
        variant: "destructive"
      });
      return;
    }
    
    exportToCSV(entries);
    toast({
      title: "Export Successful",
      description: "Quiz data has been exported to CSV file.",
    });
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (entries.length === 0) {
    return (
      <Card className="shadow-card animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Quiz History
          </CardTitle>
          <CardDescription>Your recorded quiz performances</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No quiz entries yet. Record your first quiz above!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Quiz History
            </CardTitle>
            <CardDescription>
              {entries.length} quiz{entries.length !== 1 ? 'es' : ''} recorded
            </CardDescription>
          </div>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Score</TableHead>
                <TableHead className="font-semibold">Weak Areas</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEntries.map((entry, index) => (
                <TableRow
                  key={entry.id}
                  className="transition-colors duration-200 hover:bg-muted/30 animate-slide-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <TableCell className="font-medium">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant={getScoreBadgeVariant(entry.score)} className="font-bold">
                      {entry.score}%
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {entry.weakAreas.length > 0 ? (
                        entry.weakAreas.slice(0, 3).map((area) => (
                          <Badge key={area} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                      {entry.weakAreas.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{entry.weakAreas.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedRow(
                          expandedRow === entry.id ? null : entry.id
                        )}
                        className="transition-all duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Quiz Entry</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this quiz entry? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(entry.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Expanded Row Details */}
        {expandedRow && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg animate-fade-in">
            {(() => {
              const entry = entries.find(e => e.id === expandedRow);
              if (!entry) return null;
              
              return (
                <div className="space-y-3">
                  <h4 className="font-semibold">Quiz Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">All Weak Areas:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.weakAreas.length > 0 ? (
                          entry.weakAreas.map((area) => (
                            <Badge key={area} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">None identified</span>
                        )}
                      </div>
                    </div>
                    
                    {entry.questionScores && entry.questionScores.length > 0 && (
                      <div>
                        <p className="text-sm font-medium">Question Breakdown:</p>
                        <div className="space-y-1 mt-1">
                          {entry.questionScores.map((qs, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span>{qs.topic}:</span>
                              <span className={qs.percentage < 50 ? 'text-destructive' : 'text-success'}>
                                {qs.scored}/{qs.total} ({qs.percentage}%)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Recorded on {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};