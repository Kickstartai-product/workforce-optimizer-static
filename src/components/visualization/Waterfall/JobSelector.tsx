// JobSelector.tsx
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

export const JobSelector = ({ selectedJob, setSelectedJob, jobs }: JobSelectorProps) => (
  <div className="w-full max-w-xs mb-4">
    <Select value={selectedJob} onValueChange={setSelectedJob}>
      <SelectTrigger>
        <SelectValue placeholder="Select a job" />
      </SelectTrigger>
      <SelectContent>
        {jobs.map((job) => (
          <SelectItem key={job} value={job}>
            {job}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
