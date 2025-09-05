// This file can be updated when the component changes
// For a production app, you might want to automate this process

export const datePickerCode = `"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as chrono from "chrono-node";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface NaturalLanguageDatePickerProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  placeholder?: string;
  className?: string;
  locale?: 'es' | 'en' | 'auto';
}

// Spanish to English translation dictionary (excerpt)
const translateSpanishToEnglish = (input: string): string => {
  const translations: Record<string, string> = {
    'hoy': 'today',
    'ayer': 'yesterday',
    'mañana': 'tomorrow',
    'hace una semana': '1 week ago',
    'hace dos semanas': '2 weeks ago',
    'próximo viernes': 'next friday',
    'la semana pasada': 'last week',
    // ... 60+ more expressions
  };
  return translations[input.toLowerCase().trim()] || input;
};

// Auto-detect language
const detectLanguage = (input: string): 'es' | 'en' => {
  const spanishKeywords = ['hace', 'próximo', 'hoy', 'mañana', 'semana'];
  const englishKeywords = ['next', 'last', 'ago', 'today', 'tomorrow'];
  
  const hasSpanish = spanishKeywords.some(k => input.toLowerCase().includes(k));
  const hasEnglish = englishKeywords.some(k => input.toLowerCase().includes(k));
  
  return hasSpanish && !hasEnglish ? 'es' : hasEnglish && !hasSpanish ? 'en' : 'es';
};

export function NaturalLanguageDatePicker({
  value,
  onChange,
  placeholder = "🌍 Try: 'tomorrow' or 'mañana'",
  className,
  locale = 'auto',
}: NaturalLanguageDatePickerProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(value || new Date());
  const [isError, setIsError] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (isError) setIsError(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        let parsedDate: Date | null = null;
        
        if (locale === 'auto') {
          // Auto-detect and parse intelligently
          const detectedLang = detectLanguage(inputValue);
          const translatedInput = translateSpanishToEnglish(inputValue);
          
          parsedDate = detectedLang === 'es' 
            ? chrono.es.parseDate(inputValue) || chrono.parseDate(translatedInput)
            : chrono.parseDate(inputValue) || chrono.es.parseDate(inputValue);
        } else if (locale === 'es') {
          const translatedInput = translateSpanishToEnglish(inputValue);
          parsedDate = chrono.es.parseDate(inputValue) || chrono.parseDate(translatedInput);
        } else {
          parsedDate = chrono.parseDate(inputValue);
        }
        
        if (parsedDate) {
          onChange?.(parsedDate);
          setCalendarMonth(parsedDate);
          setInputValue("");
          setIsError(false);
          setIsOpen(false);
        } else {
          setIsError(true);
          setTimeout(() => setIsError(false), 350);
        }
      }
    }
  };

  const handleSelect = (newDate: Date | undefined) => {
    onChange?.(newDate);
    if (newDate) setCalendarMonth(newDate);
  };

  return (
    <>
      <style>
        {\`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            75% { transform: translateX(2px); }
          }
          .date-picker-shake {
            animation: shake 0.15s ease-in-out 0s 2;
          }
        \`}
      </style>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !value && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "dd/MM/yyyy") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
          <div className="flex flex-col space-y-2">
            <Input
              placeholder={placeholder}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className={cn(
                "w-full transition-colors duration-200",
                isError && "date-picker-shake"
              )}
            />
            <div className="text-xs text-muted-foreground">
              🇺🇸 English: "today", "next week" • 🇪🇸 Español: "hoy", "próxima semana"
            </div>
          </div>
          <div className="rounded-md border">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleSelect}
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
            />
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

// Usage example:
// const [date, setDate] = useState<Date>();
// 
// <NaturalLanguageDatePicker
//   value={date}
//   onChange={setDate}
//   locale="auto" // 'auto' | 'en' | 'es'
// />`;
