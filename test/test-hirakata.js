'use strict';

var should = require('should');

var hirakata = require('../src/hirakata');


describe('hirakata', function() {
  describe('#toKata', function() {
    it('should return correct katakana for each hiragana', function() {
      hirakata.toKata('あいうえお').should.be.exactly('アイウエオ');
      hirakata.toKata('かきくけこ').should.be.exactly('カキクケコ');
      hirakata.toKata('さしすせそ').should.be.exactly('サシスセソ');
      hirakata.toKata('たちつてと').should.be.exactly('タチツテト');
      hirakata.toKata('なにぬねの').should.be.exactly('ナニヌネノ');
      hirakata.toKata('はひふへほ').should.be.exactly('ハヒフヘホ');
      hirakata.toKata('まみむめも').should.be.exactly('マミムメモ');
      hirakata.toKata('やゆよ').should.be.exactly('ヤユヨ');
      hirakata.toKata('らりるれろ').should.be.exactly('ラリルレロ');
      hirakata.toKata('わをん').should.be.exactly('ワヲン');
      hirakata.toKata('がぎぐげご').should.be.exactly('ガギグゲゴ');
      hirakata.toKata('ざじずぜぞ').should.be.exactly('ザジズゼゾ');
      hirakata.toKata('だぢづでど').should.be.exactly('ダヂヅデド');
      hirakata.toKata('ばびぶべぼ').should.be.exactly('バビブベボ');
      hirakata.toKata('ぱぴぷぺぽ').should.be.exactly('パピプペポ');
      hirakata.toKata('ぁぃぅぇぉ').should.be.exactly('ァィゥェォ');
      hirakata.toKata('ゃゅょ').should.be.exactly('ャュョ');
      hirakata.toKata('ゎ').should.be.exactly('ヮ');
      hirakata.toKata('っ').should.be.exactly('ッ');
      hirakata.toKata('ー').should.be.exactly('ー');
    });

    it('should return non-hiragana character as is', function() {
      hirakata.toKata('あxいyうzえzおy').should.be.exactly('アxイyウzエzオy');
    });
  });

  describe('#toHira', function() {
    it('should return correct hiragana for each katakana', function() {
      hirakata.toHira('アイウエオ').should.be.exactly('あいうえお');
      hirakata.toHira('カキクケコ').should.be.exactly('かきくけこ');
      hirakata.toHira('サシスセソ').should.be.exactly('さしすせそ');
      hirakata.toHira('タチツテト').should.be.exactly('たちつてと');
      hirakata.toHira('ナニヌネノ').should.be.exactly('なにぬねの');
      hirakata.toHira('ハヒフヘホ').should.be.exactly('はひふへほ');
      hirakata.toHira('マミムメモ').should.be.exactly('まみむめも');
      hirakata.toHira('ヤユヨ').should.be.exactly('やゆよ');
      hirakata.toHira('ラリルレロ').should.be.exactly('らりるれろ');
      hirakata.toHira('ワヲン').should.be.exactly('わをん');
      hirakata.toHira('ガギグゲゴ').should.be.exactly('がぎぐげご');
      hirakata.toHira('ザジズゼゾ').should.be.exactly('ざじずぜぞ');
      hirakata.toHira('ダヂヅデド').should.be.exactly('だぢづでど');
      hirakata.toHira('バビブベボ').should.be.exactly('ばびぶべぼ');
      hirakata.toHira('パピプペポ').should.be.exactly('ぱぴぷぺぽ');
      hirakata.toHira('ァィゥェォ').should.be.exactly('ぁぃぅぇぉ');
      hirakata.toHira('ャュョ').should.be.exactly('ゃゅょ');
      hirakata.toHira('ヮ').should.be.exactly('ゎ');
      hirakata.toHira('ッ').should.be.exactly('っ');
      hirakata.toHira('ー').should.be.exactly('ー');
    });

    it('should return non-katakana character as is', function() {
      hirakata.toHira('アxイyウzエzオy').should.be.exactly('あxいyうzえzおy');
    });
  });

  describe('#isKata', function() {
    it('should return true for katakana string', function() {
      hirakata.isKata('アイウエオ').should.be.exactly(true);
      hirakata.isKata('カキクケコ').should.be.exactly(true);
      hirakata.isKata('サシスセソ').should.be.exactly(true);
      hirakata.isKata('タチツテト').should.be.exactly(true);
      hirakata.isKata('ナニヌネノ').should.be.exactly(true);
      hirakata.isKata('ハヒフヘホ').should.be.exactly(true);
      hirakata.isKata('マミムメモ').should.be.exactly(true);
      hirakata.isKata('ヤユヨ').should.be.exactly(true);
      hirakata.isKata('ラリルレロ').should.be.exactly(true);
      hirakata.isKata('ワヲン').should.be.exactly(true);
      hirakata.isKata('ガギグゲゴ').should.be.exactly(true);
      hirakata.isKata('ザジズゼゾ').should.be.exactly(true);
      hirakata.isKata('ダヂヅデド').should.be.exactly(true);
      hirakata.isKata('バビブベボ').should.be.exactly(true);
      hirakata.isKata('パピプペポ').should.be.exactly(true);
      hirakata.isKata('ァィゥェォ').should.be.exactly(true);
      hirakata.isKata('ャュョ').should.be.exactly(true);
      hirakata.isKata('ヮ').should.be.exactly(true);
      hirakata.isKata('ッ').should.be.exactly(true);
      hirakata.isKata('ー').should.be.exactly(true);
    });

    it('should return false for non-katakana string', function() {
      hirakata.isKata('アイxウエオ').should.be.exactly(false);
    });
  });

  describe('#isHira', function() {
    it('should return true for hiragana string', function() {
      hirakata.isHira('あいうえお').should.be.exactly(true);
      hirakata.isHira('かきくけこ').should.be.exactly(true);
      hirakata.isHira('さしすせそ').should.be.exactly(true);
      hirakata.isHira('たちつてと').should.be.exactly(true);
      hirakata.isHira('なにぬねの').should.be.exactly(true);
      hirakata.isHira('はひふへほ').should.be.exactly(true);
      hirakata.isHira('まみむめも').should.be.exactly(true);
      hirakata.isHira('やゆよ').should.be.exactly(true);
      hirakata.isHira('らりるれろ').should.be.exactly(true);
      hirakata.isHira('わをん').should.be.exactly(true);
      hirakata.isHira('がぎぐげご').should.be.exactly(true);
      hirakata.isHira('ざじずぜぞ').should.be.exactly(true);
      hirakata.isHira('だぢづでど').should.be.exactly(true);
      hirakata.isHira('ばびぶべぼ').should.be.exactly(true);
      hirakata.isHira('ぱぴぷぺぽ').should.be.exactly(true);
      hirakata.isHira('ぁぃぅぇぉ').should.be.exactly(true);
      hirakata.isHira('ゃゅょ').should.be.exactly(true);
      hirakata.isHira('ゎ').should.be.exactly(true);
      hirakata.isHira('っ').should.be.exactly(true);
      hirakata.isHira('ー').should.be.exactly(true);
    });

    it('should return false for non-katakana string', function() {
      hirakata.isHira('あいxうえお').should.be.exactly(false);
    });
  });
});
