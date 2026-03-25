import { z } from "zod";

export const basicSearchSchema = z
  .object({
    applicant: z
      .string()
      .min(1, "회사명을 입력하세요"),
    startDate: z.string().min(1, "시작 날짜를 선택하세요"),
    endDate: z.string().min(1, "종료 날짜를 선택하세요"),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "시작 날짜가 종료 날짜보다 늦을 수 없습니다",
    path: ["endDate"],
  });

export type BasicSearchFormData = z.infer<typeof basicSearchSchema>;

export const advancedSearchSchema = z
  .object({
    patentName: z.string().optional(),
    companyName: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: "시작 날짜가 종료 날짜보다 늦을 수 없습니다",
      path: ["endDate"],
    }
  );

export type AdvancedSearchFormData = z.infer<typeof advancedSearchSchema>;
