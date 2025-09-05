"use client";

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


// Auto-detect language based on input content
const detectLanguage = (input: string): 'es' | 'en' => {
  const lowerInput = input.toLowerCase().trim();
  
  // Spanish indicators
  const spanishKeywords = [
    'hace', 'próximo', 'próxima', 'pasado', 'pasada', 'dentro', 'hoy', 'ayer', 'mañana',
    'semana', 'mes', 'año', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo',
    'anteayer', 'viene', 'que', 'la', 'el', 'una', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis'
  ];
  
  // English indicators  
  const englishKeywords = [
    'next', 'last', 'ago', 'in', 'today', 'yesterday', 'tomorrow', 'week', 'month', 'year',
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
    'this', 'after', 'before', 'from', 'now'
  ];
  
  const hasSpanish = spanishKeywords.some(keyword => lowerInput.includes(keyword));
  const hasEnglish = englishKeywords.some(keyword => lowerInput.includes(keyword));
  
  // If both or neither, default to Spanish (since we're adding Spanish support)
  return hasSpanish && !hasEnglish ? 'es' : hasEnglish && !hasSpanish ? 'en' : 'es';
};

// Get localized placeholders and help text
const getLocalizedTexts = (locale: 'es' | 'en' | 'auto') => {
  if (locale === 'en') {
    return {
      placeholder: "Try 'tomorrow', 'next friday', 'in 2 weeks'",
      helpText: "Press Enter to confirm • Examples: \"today\", \"2 weeks ago\", \"next friday\", \"last week\"",
      dateFormat: "PPP" as const,
      buttonText: "Pick a date"
    };
  } else if (locale === 'es') {
    return {
      placeholder: "Ej: 'mañana', 'próximo viernes', 'hace dos semanas'",
      helpText: "Presiona Enter para confirmar • Ejemplos: \"hoy\", \"hace dos semanas\", \"próximo viernes\", \"la semana pasada\"",
      dateFormat: "dd/MM/yyyy" as const,
      buttonText: "dd-mm-aaaa"
    };
  } else { // auto
    return {
      placeholder: "🌍 Try: 'tomorrow' or 'mañana' | 'next friday' or 'próximo viernes'",
      helpText: "🇺🇸 English: \"today\", \"next week\" • 🇪🇸 Español: \"hoy\", \"próxima semana\" • Press Enter to confirm",
      dateFormat: "dd/MM/yyyy" as const,
      buttonText: "Pick a date"
    };
  }
};

// Comprehensive Spanish to English translation dictionary
const translateSpanishToEnglish = (input: string): string => {
  const translations: Record<string, string> = {
    // Basic time expressions
    'hoy': 'today',
    'ayer': 'yesterday',
    'mañana': 'tomorrow',
    
    // Past expressions with "hace"
    'hace una semana': '1 week ago',
    'hace 1 semana': '1 week ago',
    'hace dos semanas': '2 weeks ago',
    'hace 2 semanas': '2 weeks ago',
    'hace tres semanas': '3 weeks ago',
    'hace 3 semanas': '3 weeks ago',
    'hace cuatro semanas': '4 weeks ago',
    'hace 4 semanas': '4 weeks ago',
    'hace un mes': '1 month ago',
    'hace 1 mes': '1 month ago',
    'hace dos meses': '2 months ago',
    'hace 2 meses': '2 months ago',
    'hace tres meses': '3 months ago',
    'hace 3 meses': '3 months ago',
    'hace cuatro meses': '4 months ago',
    'hace 4 meses': '4 months ago',
    'hace cinco meses': '5 months ago',
    'hace 5 meses': '5 months ago',
    'hace seis meses': '6 months ago',
    'hace 6 meses': '6 months ago',
    'hace un año': '1 year ago',
    'hace 1 año': '1 year ago',
    'hace dos años': '2 years ago',
    'hace 2 años': '2 years ago',
    
    // Alternative past expressions
    'la semana pasada': 'last week',
    'el mes pasado': 'last month',
    'el año pasado': 'last year',
    'anteayer': '2 days ago',
    
    // Future expressions
    'pasado mañana': 'day after tomorrow',
    'dentro de una semana': 'in 1 week',
    'dentro de 1 semana': 'in 1 week',
    'dentro de dos semanas': 'in 2 weeks',
    'dentro de 2 semanas': 'in 2 weeks',
    'dentro de tres semanas': 'in 3 weeks',
    'dentro de 3 semanas': 'in 3 weeks',
    'dentro de un mes': 'in 1 month',
    'dentro de 1 mes': 'in 1 month',
    'dentro de dos meses': 'in 2 months',
    'dentro de 2 meses': 'in 2 months',
    'dentro de tres meses': 'in 3 months',
    'dentro de 3 meses': 'in 3 months',
    
    // Specific future days with "próximo"
    'el próximo lunes': 'next monday',
    'el próximo martes': 'next tuesday',
    'el próximo miércoles': 'next wednesday',
    'el próximo jueves': 'next thursday',
    'el próximo viernes': 'next friday',
    'el próximo sábado': 'next saturday',
    'el próximo domingo': 'next sunday',
    
    // Alternative future days with "que viene"
    'el lunes que viene': 'next monday',
    'el martes que viene': 'next tuesday',
    'el miércoles que viene': 'next wednesday',
    'el jueves que viene': 'next thursday',
    'el viernes que viene': 'next friday',
    'el sábado que viene': 'next saturday',
    'el domingo que viene': 'next sunday',
    
    // Past specific days
    'el lunes pasado': 'last monday',
    'el martes pasado': 'last tuesday',
    'el miércoles pasado': 'last wednesday',
    'el jueves pasado': 'last thursday',
    'el viernes pasado': 'last friday',
    'el sábado pasado': 'last saturday',
    'el domingo pasado': 'last sunday',
    
    // Week references
    'esta semana': 'this week',
    'la próxima semana': 'next week',
    'la semana que viene': 'next week',
    
    // Month references
    'este mes': 'this month',
    'el próximo mes': 'next month',
    'el mes que viene': 'next month',
    
    // Year references
    'este año': 'this year',
    'el próximo año': 'next year',
    'el año que viene': 'next year',
  };

  const lowerInput = input.toLowerCase().trim();
  return translations[lowerInput] || input;
};

export function NaturalLanguageDatePicker({
  value,
  onChange,
  placeholder,
  className,
  locale = 'auto',
}: NaturalLanguageDatePickerProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(value || new Date());
  const [isError, setIsError] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  // Get localized texts based on locale prop
  const localizedTexts = getLocalizedTexts(locale);
  const finalPlaceholder = placeholder || localizedTexts.placeholder;

  // Sync calendar month with external value changes
  React.useEffect(() => {
    if (value) {
      setCalendarMonth(value);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (isError) setIsError(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        let parsedDate: Date | null = null;
        
        if (locale === 'en') {
          // English-only mode
          parsedDate = chrono.parseDate(inputValue);
        } else if (locale === 'es') {
          // Spanish-only mode
          const translatedInput = translateSpanishToEnglish(inputValue);
          parsedDate = chrono.es.parseDate(inputValue) ||           // 1st: Spanish parser
                      chrono.parseDate(translatedInput) ||          // 2nd: Translated to English  
                      chrono.parseDate(inputValue);                 // 3rd: Original English parser
        } else {
          // Auto mode: detect language and use intelligent parsing
          const detectedLang = detectLanguage(inputValue);
          
          if (detectedLang === 'es') {
            // Detected Spanish: prioritize Spanish parsing
            const translatedInput = translateSpanishToEnglish(inputValue);
            parsedDate = chrono.es.parseDate(inputValue) ||         // 1st: Spanish parser
                        chrono.parseDate(translatedInput) ||        // 2nd: Translated to English
                        chrono.parseDate(inputValue);               // 3rd: English fallback
          } else {
            // Detected English: prioritize English parsing, but still support Spanish
            const translatedInput = translateSpanishToEnglish(inputValue);
            parsedDate = chrono.parseDate(inputValue) ||            // 1st: English parser
                        chrono.es.parseDate(inputValue) ||          // 2nd: Spanish parser
                        chrono.parseDate(translatedInput);          // 3rd: Translated fallback
          }
        }
        
        if (parsedDate) {
          onChange?.(parsedDate);
          setCalendarMonth(parsedDate);
          setInputValue("");
          setIsError(false);
          setIsOpen(false); // Auto-close popover on successful parse
        } else {
          setIsError(true);
          setTimeout(() => setIsError(false), 350);
        }
      }
    }
  };

  // Handle calendar date selection
  const handleSelect = (newDate: Date | undefined) => {
    onChange?.(newDate);
    if (newDate) {
      setCalendarMonth(newDate);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            75% { transform: translateX(2px); }
          }
          
          .date-picker-shake {
            animation: shake 0.15s ease-in-out 0s 2;
          }
        `}
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
            {value ? format(value, localizedTexts.dateFormat) : <span>{localizedTexts.buttonText}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="flex w-auto flex-col space-y-2 p-2"
        >
          <div className="flex flex-col space-y-2">
            <Input
              placeholder={finalPlaceholder}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className={cn(
                "w-full transition-colors duration-200",
                isError && "date-picker-shake"
              )}
            />
            <div className="text-xs text-muted-foreground">
              {localizedTexts.helpText}
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
