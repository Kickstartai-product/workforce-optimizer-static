import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobSelectorProps {
  selectedJob: string;
  setSelectedJob: (job: string) => void;
  jobs: string[];
}

export const JobSelector = ({ selectedJob, setSelectedJob, jobs }: JobSelectorProps) => {
  const formatJobName = (job: string) => {
    return job
      .replace(/\n\-/g, "") // Remove newline-hyphen combinations
      .replace(/\\\-\n/g, "") // Remove escaped-hyphen-newline combinations
      .replace(/\n/g, " "); // Replace remaining newlines with spaces
  };

  return (
    <div className="w-full max-w-xs mb-4">
      <Select value={selectedJob} onValueChange={setSelectedJob}>
        <SelectTrigger>
          <SelectValue placeholder="Select a job" />
        </SelectTrigger>
        <SelectContent>
          {jobs.map((job) => (
            <SelectItem key={job} value={job}>
              {formatJobName(job)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}