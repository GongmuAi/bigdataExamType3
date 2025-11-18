'use client';

import { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star, Copy, Check, Sparkles, Loader2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { NodeData } from '@/types/mindmap';
import { sampleCodes } from '@/data/sample-codes';
import { useNodeExpansion } from '@/contexts/NodeExpansionContext';

interface ParsedQuestion {
  problem: string;
  dataCode: string;
  solution: string;
}

const StatMethodNode = ({ data, id }: NodeProps) => {
  const { expandedNodeId, setExpandedNodeId } = useNodeExpansion();
  const isExpanded = expandedNodeId === id;

  const [copied, setCopied] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [showPractice, setShowPractice] = useState(false);
  const [practiceQuestion, setPracticeQuestion] = useState('');
  const [parsedQuestion, setParsedQuestion] = useState<ParsedQuestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const nodeData = data as NodeData;

  const code = sampleCodes[id] || '';

  // Close practice panel when node collapses
  useEffect(() => {
    if (!isExpanded) {
      setShowPractice(false);
    }
  }, [isExpanded]);

  const handleToggle = () => {
    if (isExpanded) {
      setExpandedNodeId(null);
    } else {
      setExpandedNodeId(id);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySection = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const parseGeneratedQuestion = (text: string): ParsedQuestion => {
    let problem = '';
    let dataCode = '';
    let solution = '';

    // Extract problem section (from beginning up to but not including "## 힌트" or "## 정답")
    // This includes: title, scenario, data code section, and question section
    const problemMatch = text.match(/^([\s\S]*?)(?=## 힌트|## 정답)/i);
    if (problemMatch) {
      problem = problemMatch[1].trim();
    }

    // Extract data generation code
    const dataMatch = text.match(/## 데이터[\s\S]*?```python\n([\s\S]*?)```/i) ||
                      text.match(/### 데이터[\s\S]*?```python\n([\s\S]*?)```/i) ||
                      text.match(/데이터 생성[\s\S]*?```python\n([\s\S]*?)```/i);
    if (dataMatch) {
      dataCode = dataMatch[1].trim();
    }

    // Extract solution code (last python code block or after "정답" / "풀이")
    const solutionMatch = text.match(/## 정답[\s\S]*?```python\n([\s\S]*?)```/i) ||
                          text.match(/### 정답[\s\S]*?```python\n([\s\S]*?)```/i) ||
                          text.match(/## 풀이[\s\S]*?```python\n([\s\S]*?)```/i) ||
                          text.match(/정답 코드[\s\S]*?```python\n([\s\S]*?)```/i);
    if (solutionMatch) {
      solution = solutionMatch[1].trim();
    }

    // If no structured parsing worked, try to extract all code blocks
    if (!dataCode && !solution) {
      const codeBlocks = text.match(/```python\n([\s\S]*?)```/g);
      if (codeBlocks && codeBlocks.length > 0) {
        if (codeBlocks.length === 1) {
          solution = codeBlocks[0].replace(/```python\n|```/g, '').trim();
        } else {
          dataCode = codeBlocks[0].replace(/```python\n|```/g, '').trim();
          solution = codeBlocks[codeBlocks.length - 1].replace(/```python\n|```/g, '').trim();
        }
      }
    }

    // If still no problem text, use everything before "## 힌트" or "## 정답"
    if (!problem) {
      const beforeHint = text.split(/## 힌트|## 정답/i)[0];
      problem = beforeHint.trim();
    }

    return { problem, dataCode, solution };
  };

  const generatePracticeQuestion = async () => {
    setIsGenerating(true);
    setShowPractice(true);
    setPracticeQuestion('');
    setParsedQuestion(null);

    try {
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          methodName: nodeData.metadata?.functionName || nodeData.label,
          library: nodeData.metadata?.library || '',
          note: nodeData.metadata?.note || '',
          sampleCode: code,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate question');
      }

      const data = await response.json();
      const questionText = data.question;
      setPracticeQuestion(questionText);
      setParsedQuestion(parseGeneratedQuestion(questionText));
    } catch (error) {
      console.error('Error generating question:', error);
      setPracticeQuestion('예상문제 생성 중 오류가 발생했습니다.');
      setParsedQuestion(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const getImportanceStars = (importance: number) => {
    return Array(importance)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className="h-3 w-3 fill-yellow-400 text-yellow-400"
        />
      ));
  };

  const getLibraryColor = (library: string) => {
    switch (library) {
      case 'scipy.stats':
        return 'bg-blue-500';
      case 'statsmodels':
        return 'bg-green-500';
      case 'sklearn':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const CopyButton = ({ text, section }: { text: string; section: string }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 px-2"
      onClick={(e) => {
        e.stopPropagation();
        handleCopySection(text, section);
      }}
    >
      {copiedSection === section ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );

  return (
    <div className="relative min-w-[350px]" style={{ zIndex: isExpanded ? 9999 : 'auto' }}>
      <Handle type="target" position={Position.Left} className="!bg-gray-400" />

      <Card
        className={`border-2 transition-all duration-200 cursor-pointer ${
          isExpanded
            ? 'border-orange-400 shadow-lg'
            : 'border-orange-300 hover:border-orange-400'
        }`}
        onClick={handleToggle}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold whitespace-pre-line leading-tight">
              {nodeData.label}
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              {isExpanded ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>
          </div>
          {nodeData.metadata && (
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge
                className={`${getLibraryColor(nodeData.metadata.library)} text-white text-sm`}
              >
                {nodeData.metadata.library}
              </Badge>
              <div className="flex items-center gap-0.5">
                {getImportanceStars(nodeData.metadata.importance)}
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-400"
      />

      {isExpanded && code && (
        <Card
          className="absolute left-[370px] top-0 border-2 border-orange-400 shadow-lg bg-white min-w-[500px] max-w-[600px]"
          style={{ zIndex: 10000 }}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              {nodeData.metadata && (
                <div className="flex-1">
                  <Badge variant="outline" className="text-sm font-mono">
                    {nodeData.metadata.functionName}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {nodeData.metadata.note}
                  </p>
                </div>
              )}
              <Button
                variant="default"
                size="lg"
                className="ml-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 text-base shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  generatePracticeQuestion();
                }}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    {practiceQuestion ? '새 문제 생성' : '예상문제 생성'}
                  </>
                )}
              </Button>
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">샘플 코드</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy();
                    }}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="rounded-md border overflow-hidden">
                <SyntaxHighlighter
                  language="python"
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    fontSize: '12px',
                    borderRadius: '6px',
                    maxHeight: 'none',
                    overflow: 'visible',
                  }}
                  wrapLongLines={true}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showPractice && (
        <Card
          className="absolute left-[1000px] top-0 border-2 border-green-400 shadow-lg bg-white min-w-[600px] max-w-[700px]"
          style={{ zIndex: 10001 }}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-500" />
                예상문제
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPractice(false);
                }}
              >
                닫기
              </Button>
            </div>

            {isGenerating ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-green-500" />
              </div>
            ) : parsedQuestion ? (
              <div className="space-y-4">
                {/* Problem Statement */}
                {parsedQuestion.problem && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-blue-600">📋 문제</span>
                      <CopyButton text={parsedQuestion.problem} section="problem" />
                    </div>
                    <div className="bg-blue-50 rounded-md p-3 text-sm whitespace-pre-wrap border border-blue-200">
                      {parsedQuestion.problem}
                    </div>
                  </div>
                )}

                {/* Data Generation Code */}
                {parsedQuestion.dataCode && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-purple-600">📊 데이터 생성 코드</span>
                      <CopyButton text={parsedQuestion.dataCode} section="data" />
                    </div>
                    <div className="rounded-md border overflow-hidden">
                      <SyntaxHighlighter
                        language="python"
                        style={oneDark}
                        customStyle={{
                          margin: 0,
                          fontSize: '11px',
                          borderRadius: '6px',
                        }}
                        wrapLongLines={true}
                      >
                        {parsedQuestion.dataCode}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}

                {/* Solution Code */}
                {parsedQuestion.solution && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-green-600">✅ 정답 코드</span>
                      <CopyButton text={parsedQuestion.solution} section="solution" />
                    </div>
                    <div className="rounded-md border overflow-hidden">
                      <SyntaxHighlighter
                        language="python"
                        style={oneDark}
                        customStyle={{
                          margin: 0,
                          fontSize: '11px',
                          borderRadius: '6px',
                        }}
                        wrapLongLines={true}
                      >
                        {parsedQuestion.solution}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}

                {/* Fallback: Raw Text if parsing failed */}
                {!parsedQuestion.problem && !parsedQuestion.dataCode && !parsedQuestion.solution && (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {practiceQuestion}
                  </div>
                )}
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {practiceQuestion}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default memo(StatMethodNode);
